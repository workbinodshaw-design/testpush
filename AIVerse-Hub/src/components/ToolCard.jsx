import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ShieldCheck, Heart, Bookmark } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, onSnapshot, writeBatch, increment, serverTimestamp, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase';

const ToolCard = ({ tool }) => {
  const { currentUser, userBookmarks } = useAuth();
  const navigate = useNavigate();
  const [localUpvotes, setLocalUpvotes] = useState(tool.upvotes || 0);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isBookmarked = userBookmarks?.includes(tool.id);

  // 1. HYDRATION: Listen to live upvote counts directly from the Cloud
  useEffect(() => {
    const toolRef = doc(db, 'tools', tool.id);
    const unsubscribe = onSnapshot(toolRef, (snapshot) => {
      if (snapshot.exists()) {
        setLocalUpvotes(snapshot.data().upvotes || 0);
      }
    });
    return () => unsubscribe();
  }, [tool.id]);

  // 2. RECEIPT CHECK: See if the current user permanently voted for this
  useEffect(() => {
    if (!currentUser) {
      setHasVoted(false);
      return;
    }
    const checkVoteStatus = async () => {
      try {
        const voteRef = doc(db, 'tools', tool.id, 'upvotes', currentUser.uid);
        const voteSnap = await getDoc(voteRef);
        if (voteSnap.exists()) {
          setHasVoted(true);
        }
      } catch (err) {
        console.error("Failed to check vote receipt:", err);
      }
    };
    checkVoteStatus();
  }, [currentUser, tool.id]);

  const handleUpvote = async (e) => {
    e.preventDefault(); 
    e.stopPropagation();

    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (isVoting || hasVoted) return;

    setIsVoting(true);
    setHasVoted(true);
    setLocalUpvotes(prev => prev + 1);

    try {
      const batch = writeBatch(db);
      const toolRef = doc(db, 'tools', tool.id);
      const voteRef = doc(db, 'tools', tool.id, 'upvotes', currentUser.uid);
      
      batch.update(toolRef, { upvotes: increment(1) });
      batch.set(voteRef, { timestamp: serverTimestamp() });
      
      await batch.commit();
    } catch (error) {
      console.error("Error upvoting (are your rules set up correctly?):", error);
      setHasVoted(false);
      setLocalUpvotes(prev => prev - 1);
    } finally {
      setIsVoting(false);
    }
  };

  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (isBookmarking) return;
    setIsBookmarking(true);

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      if (isBookmarked) {
        await updateDoc(userRef, { bookmarks: arrayRemove(tool.id) });
      } else {
        await updateDoc(userRef, { bookmarks: arrayUnion(tool.id) });
      }
    } catch (error) {
      console.error("Error bookmarking tool:", error);
      // Fallback if the user profile document doesn't exist yet
      if (error.code === 'not-found') {
        const userRef = doc(db, 'users', currentUser.uid);
        import('firebase/firestore').then(({ setDoc }) => {
            setDoc(userRef, { bookmarks: [tool.id] }, { merge: true });
        });
      }
    } finally {
      setIsBookmarking(false);
    }
  };

  return (
    <div className="tool-card" style={{
      background: 'var(--card-bg)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '1px solid var(--card-border)',
      borderRadius: 'var(--radius-xl)',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      position: 'relative',
      overflow: 'hidden',
      cursor: 'pointer'
    }}>
      {/* Glass Glow Effect */}
      <div className="tool-glow" style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(93,13,24,0.05) 0%, transparent 70%)',
        opacity: 0,
        transition: 'opacity 0.4s ease',
        pointerEvents: 'none',
        zIndex: 0
      }}></div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 1 }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {tool.logo && !imageError ? (
            <img 
              src={tool.logo} 
              alt={tool.name} 
              onError={() => setImageError(true)}
              style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} 
            />
          ) : (
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.2rem', boxShadow: '0 4px 15px rgba(93, 13, 24, 0.2)' }}>
              {tool.name.charAt(0)}
            </div>
          )}
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)' }}>
              {tool.name}
              {tool.verified && <ShieldCheck size={16} className="text-blue-500" />}
            </h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{tool.category}</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {/* BOOKMARK BUTTON */}
            <button 
              onClick={handleBookmark}
              disabled={isBookmarking}
              title={isBookmarked ? "Remove Bookmark" : "Save Tool"}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent',
                border: 'none',
                color: isBookmarked ? 'var(--accent-secondary)' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                padding: '0.3rem',
                borderRadius: '50%'
              }}
            >
              <Bookmark size={20} fill={isBookmarked ? "currentColor" : "none"} />
            </button>

            {/* UPVOTE BUTTON */}
            <button 
              onClick={handleUpvote}
              disabled={isVoting || hasVoted}
              title={hasVoted ? "You have already upvoted this tool" : "Upvote tool"}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.4rem', 
                fontSize: '0.9rem', 
                color: hasVoted ? '#ef4444' : 'var(--text-secondary)',
                background: hasVoted ? 'rgba(239, 68, 68, 0.1)' : 'var(--btn-bg)',
                border: `1px solid ${hasVoted ? 'rgba(239, 68, 68, 0.3)' : 'var(--btn-border)'}`,
                padding: '0.3rem 0.75rem',
                borderRadius: '2rem',
                cursor: (isVoting || hasVoted) ? 'default' : 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <Heart size={14} className={hasVoted ? "text-red-500" : ""} fill={hasVoted ? "currentColor" : "none"} /> 
              <span style={{ fontWeight: hasVoted ? 600 : 400 }}>{localUpvotes}</span>
            </button>
          </div>
        </div>
      </div>

      <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5', flexGrow: 1, zIndex: 1 }}>
        {tool.description?.length > 120 ? tool.description.substring(0, 120) + '...' : tool.description}
      </p>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem', zIndex: 1 }}>
        {tool.tags?.slice(0, 3).map(tag => (
          <span key={tag} style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', background: 'var(--bg-tertiary)', borderRadius: '4px', color: 'var(--text-secondary)', border: '1px solid var(--glass-border)' }}>
            #{tag}
          </span>
        ))}
      </div>

      <a href={tool.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', zIndex: 1, position: 'relative' }}>
        Visit Website <ArrowUpRight size={16} />
      </a>
      
      <style>{`
        .tool-card:hover {
          transform: translateY(-5px) scale(1.02);
          border-color: var(--card-hover-border);
          box-shadow: 0 15px 30px rgba(0,0,0,0.05), 0 0 20px rgba(93, 13, 24, 0.1);
        }
        .tool-card:hover .tool-glow {
          opacity: 1;
        }
        .tool-card:hover .btn-outline {
          background: var(--accent-primary);
          color: white;
          border-color: transparent;
        }
      `}</style>
    </div>
  );
};

export default ToolCard;
