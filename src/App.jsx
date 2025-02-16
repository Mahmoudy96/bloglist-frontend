import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {    
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')    
    if (loggedUserJSON) {      
      const user = JSON.parse(loggedUserJSON)      
      setUser(user)      
      blogService.setToken(user.token)    
    }  
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password, })
      console.log(user)
      setUser(user)
      setUsername('')
      setPassword('')
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
    }
    catch (exception) {
      setMessage('Wrong credentials')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedBlogappUser')
  }

  const addBlog = async (event) => {
    event.preventDefault()
    const newBlog = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
      likes: 0
    }
    blogService.create(newBlog).then(createdBlog => {
    setBlogs(blogs.concat(createdBlog))
    setMessage('Added blog ' + newTitle + ' by ' + newAuthor)
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  })

  }

  if (user === null) {
    return (
      <div>
        <Notification message={message} messageType="error"/>
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>)
  }
  return (
    <div>
      <Notification message={message} messageType="newBlog"/>
      <h2>blogs</h2>
      {user.name} logged in
      <button onClick={handleLogout}>logout</button>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
      <h2> create new blog </h2>
      <form onSubmit={addBlog}>
        <div>Title:
          <input
            type="text"
            value={newTitle}
            name="Title"
            onChange={({ target }) => setNewTitle(target.value)}
          />
          </div>
          <div>
          Author:
          <input
            type="text"
            value={newAuthor}
            name="Author"
            onChange={({ target }) => setNewAuthor(target.value)}
          />
          </div>
          <div>
          URL:
          <input
            type="text"
            value={newUrl}
            name="URL"
            onChange={({ target }) => setNewUrl(target.value)}
          />
          </div>
        <button type="submit">create</button>

      </form>

    </div>
  )
}

export default App