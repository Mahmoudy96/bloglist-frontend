const { test, expect, beforeEach, describe } = require('@playwright/test')
const { create } = require('domain')
const { createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'User',
        username: 'user',
        password: '123'
      }
    })
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = await page.getByText('log in')
    await expect(locator).toBeVisible()
    await expect(page.getByText('Log in to application')).toBeVisible()
  })
  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByTestId('username').fill('user')
      await page.getByTestId('password').fill('123')

      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('User logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByTestId('username').fill('user')
      await page.getByTestId('password').fill('bad')

      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Wrong credentials')).toBeVisible()
    })
  })
  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByTestId('username').fill('user')
      await page.getByTestId('password').fill('123')

      await page.getByRole('button', { name: 'login' }).click()
    })
    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'Test title', 'Test author', 'Test url')
      await expect(page.getByText('Test title Test author')).toBeVisible()
    })
    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, 'Test title', 'Test author', 'Test url')

      await page.getByRole('button', { name: 'view' }).click()
      await page.getByRole('button', { name: 'like' }).click()

      await expect(page.getByText('1 likes')).toBeVisible()
    })
    test('a blog can be deleted', async ({ page }) => {
      await createBlog(page, 'Test title', 'Test author', 'Test url')
      await page.getByRole('button', { name: 'view' }).click()

      page.on('dialog', dialog => dialog.accept())
      await page.getByRole('button', { name: 'delete' }).click()

      await expect(page.getByText('Test title Test author')).not.toBeVisible()
    })
    test('other users cannot delete a blog', async ({ page, request }) => {
      await request.post('http://localhost:3003/api/users', {
        data: {
          name: 'Other',
          username: 'other',
          password: '123'
        }
      })
      await createBlog(page, 'Test title', 'Test author', 'Test url')
      await page.getByRole('button', { name: 'logout' }).click()

      await page.getByTestId('username').fill('other')
      await page.getByTestId('password').fill('123')

      await page.getByRole('button', { name: 'login' }).click()

      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByRole('button', { name: 'delete' })).not.toBeVisible()
    })
    test('blogs are ordered by likes', async ({ page }) => {

      await createBlog(page, 'first blog', 'first author', 'first url')
      await page.getByRole('button', { name: 'view' }).click()

      await createBlog(page, 'second blog', 'second author', 'second url')
      await page.getByRole('button', { name: 'view' }).click()

      //add a like to whichever blog
      page.locator('.hidden.content',{ hasText: 'first url' }).getByRole('button', { name: 'like' }).click()
      //make sure that first blog is in first place
      await expect(page.locator('.hidden.content').nth(0)).toContainText('first url')
      //add two likes to the second blog
      await page.locator('.hidden.content', { hasText: 'second url' } ).getByRole('button', { name: 'like' }).click()
      await page.locator('.hidden.content', { hasText: 'second url' } ).getByRole('button', { name: 'like' }).click()
      //make sure that second blog is in first position now
      await expect(page.locator('li').nth(0)).toContainText('second url')
    })
  })
})