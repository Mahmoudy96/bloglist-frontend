import { useState } from 'react'
const Blog = ({ blog, user, updateBlog, deleteBlog }) => {
  const [visible, setVisible] = useState(false)
  const addLikeToBlog = () => {
    updateBlog({
      ...blog,
      likes: blog.likes + 1
    })
  }
  const removeBlog = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      deleteBlog(blog.id)
    }
  }
  return (
    <li className='blog'>
      {blog.title} {blog.author} <br />

      <div style={{ display: visible ? 'none' : '' }}>
        <button onClick={() => setVisible(true)}>view</button>
      </div>
      <div className='hidden content' style={{ display: visible ? '' : 'none' }}>
        <button onClick={() => setVisible(false)}>hide</button>
        {blog.url} <br />
        {blog.likes} likes <button onClick={addLikeToBlog}>like</button> <br />
        {blog.user.name} <br />
        <div style={{ display: blog.user.username === user.username ? '' : 'none' }}>
          <button onClick={removeBlog}>DELETE</button>
        </div>
      </div>
    </li>
  )
}
export default Blog