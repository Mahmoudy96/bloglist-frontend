import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('Blog name and author shown', () => {
  const blog = {
    title: 'test title',
    author: 'me',
    url: 'abc.com',
    likes: 1,
    user: {
      username:'user'
    }
  }
  const user = {
    username:'user'
  }


  const {container} = render(<Blog blog={blog} user={user} updateBlog={()=>{}} deleteBlog={()=>{}}/>)
  const element = container.querySelector('.blog')
  expect(element).toHaveTextContent('test title me view')

  const div = container.querySelector('.hidden.content')
  expect(div).toHaveStyle('display: none')
  //screen.debug()
})

test('Blog url and likes shown when view button clicked', async () => {
  const blog = {
    title: 'test title',
    author: 'me',
    url: 'abc.com',
    likes: 1,
    user: {
      username:'user'
    }
  }
  const user = {
    username:'user'
  }
  const {container} = render(<Blog blog={blog} user={user} updateBlog={()=>{}} deleteBlog={()=>{}}/>)
  const button = screen.getByText('view')
  await userEvent.click(button)

  const div = container.querySelector('.hidden.content')
  expect(div).not.toHaveStyle('display: none')
})

test('Like button registers two clicks', async () => {
  const blog = {
    title: 'test title',
    author: 'me',
    url: 'abc.com',
    likes: 1,
    user: {
      username:'user'
    }
  }
  const user = {
    username:'user'
  }

  const mockHandler = vi.fn()

  const {container} = render(<Blog blog={blog} user={user} updateBlog={mockHandler} deleteBlog={()=>{}}/>)
  const button = screen.getByText('like')
  await userEvent.click(button)
  await userEvent.click(button)
  expect(mockHandler.mock.calls).toHaveLength(2)  
})