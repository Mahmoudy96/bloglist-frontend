import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Toggleable from './components/Toggleable'
import CreateBlog from './components/CreateBlog'

import blogService from './services/blogs'
import loginService from './services/login'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)


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

  const createBlog = (newBlog) => {
    blogService.create(newBlog).then(createdBlog => {
      setBlogs(blogs.concat(createdBlog))
      setMessage('Added blog ' + createdBlog.title + ' by ' + createdBlog.author)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    })
  }
  const deleteBlog = (id) => {
    blogService.remove(id).then(() => {
      setBlogs(blogs.filter(b => b.id !== id))
    })
  }
  const updateBlog = (blog) => {
    blogService.update(blog.id, blog).then(updatedBlog => {
      setBlogs(blogs.map(b => b.id === updatedBlog.id ? updatedBlog : b))
    })
  }
  if (user === null) {
    return (
      <div>
        <Notification message={message} messageType="error" />
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
      <Notification message={message} messageType="newBlog" />
      <h2>blogs</h2>
      {user.name} logged in
      <button onClick={handleLogout}>logout</button>
      {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
        <Blog key={blog.id} blog={blog} user={user} updateBlog={updateBlog} deleteBlog={deleteBlog} />
      )}
      <Toggleable buttonLabel="new blog">
        <CreateBlog
          createBlog={createBlog}
        />
      </Toggleable>


    </div>
  )
}

export default App