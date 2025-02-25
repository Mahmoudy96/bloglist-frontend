const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'new blog' }).click()

  await page.locator('#title-input').fill(title)
  await page.locator('#author-input').fill(author)
  await page.locator('#url-input').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
  await page.getByRole('button', { name: 'cancel' }).click()

}

export { createBlog }