fetch('https://testpush-mauve.vercel.app/api/subscribe', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@example.com' })
})
.then(r => r.text())
.then(console.log)
.catch(console.error);
