import {useState} from 'react'

const CreateBlog = ({ createBlog}) => {
      const [newTitle, setNewTitle] = useState('')
      const [newAuthor, setNewAuthor] = useState('')
      const [newUrl, setNewUrl] = useState('')
    

      const addBlog = (event) => {
        event.preventDefault()
        createBlog({
            title: newTitle,
            author: newAuthor,
            url: newUrl,
            likes: 0
        })
        setNewTitle('')
        setNewAuthor('')
        setNewUrl('')
    }
    return (
        <div>
    <h2> create new blog </h2>
    <form onSubmit={addBlog}>
      <div>Title:
        <input
          type="text"
          value={newTitle}
          name="Title"
          onChange={({target}) => setNewTitle(target.value)}
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
    </div>)
}

export default CreateBlog