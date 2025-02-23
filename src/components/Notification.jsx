const Notification = ({ message, messageType }) => {
  if (message === null) {
    return null
  }
  if (messageType === 'error') {
    return <div className="error">{message}</div>
  } else if (messageType === 'newBlog') {
    return <div className="newBlog">{message}</div>
  } else {
    return null
  }
}

export default Notification