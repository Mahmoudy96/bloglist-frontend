import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateBlog from './CreateBlog'

test('CreateBlog form calls event handler with correct details', async () => {
  const mockCreateBlog = vi.fn()
  const { container } = render(<CreateBlog createBlog={mockCreateBlog} />)
  const title = container.querySelector('#title-input')
  const author = container.querySelector('#author-input')
  const url = container.querySelector('#url-input')
  await userEvent.type(title, 'test title')
  await userEvent.type(author, 'me')
  await userEvent.type(url, 'abc.com')
  await userEvent.click(screen.getByRole('button', { name: 'create' }))
  console.log(mockCreateBlog.mock.calls)
  expect(mockCreateBlog.mock.calls).toHaveLength(1)
  expect(mockCreateBlog.mock.calls[0][0]).toEqual({
    title: 'test title',
    author: 'me',
    url: 'abc.com',
    likes: 0
  })
})