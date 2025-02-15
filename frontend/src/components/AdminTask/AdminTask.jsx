const AdminTask = ({ task }) => {
    return (
      <div style={taskStyles}>
        <h3>{task.name}</h3>
        <p>{task.description}</p>
        <p>Status: {task.status}</p>
        <p>Priority: {task.priority}</p>
        <p>Email: {task.email}</p>
        <p>Created: {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : "N/A"}</p>
        <p>Deadline: {task.deadline ? new Date(task.deadline).toLocaleDateString() : "N/A"}</p>
      </div>
    );
  };
  
  const taskStyles = {
    border: '1px solid #ccc',
    padding: '15px',
    margin: '10px 0',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
    width: '25%',
    height: '50%'
  };

export default AdminTask;
