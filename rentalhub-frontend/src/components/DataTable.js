function DataTable({ columns, data, onEdit, onDelete, onView }) {
  return (
    <table className="table table-bordered mt-3">
      <thead className="table-dark">
        <tr>
          {columns.map((col) => (
            <th key={col}>{col}</th>
          ))}
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {data.map((item) => (
          <tr key={item.userId || item.id}>
            {columns.map((col) => (
              <td key={col}>{item[col]}</td>
            ))}
            <td>
              <button className="btn btn-info btn-sm me-1" onClick={() => onView(item)}>View</button>
              <button className="btn btn-warning btn-sm me-1" onClick={() => onEdit(item)}>Edit</button>
              <button className="btn btn-danger btn-sm" onClick={() => onDelete(item)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DataTable;
