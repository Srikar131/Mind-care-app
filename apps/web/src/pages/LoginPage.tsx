function LoginPage() {
  const handleClick = () => {
    alert('Button clicked!')
  }
  
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>Login Test</h1>
      <button onClick={handleClick} style={{
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
      }}>
        Click Me
      </button>
    </div>
  )
}

function App() {
  return <LoginPage />
}

export default App
