import { DataGrid } from "@material-ui/data-grid";

import React, { useState, useEffect } from "react";
export default function StickyHeadTable(props) {
  const[data, setData] = useState({})
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(data["content"]);
  const [loading, setLoading] = useState(false);
  const { columns } = props;


  const handlePageChange = (params) => {
    setPage(params.page);
  };

//   useEffect(() => {
//     let active = true;

//     (async () => {
//       setLoading(true);
//       const newRows = await loadServerRows(page, data);

//       if (!active) {
//         return;
//       }

//       setRows(newRows);
//       setLoading(false);
//     })();

//     return () => {
//       active = false;
//     };
//   }, [page, data]);


  return (
    <DataGrid
      rows={rows}
      columns={columns}
      pagination
      pageSize={5}
      rowCount={data["totalElements"]}
      paginationMode="server"
      onPageChange={handlePageChange}
      loading={loading}
    />
  );
}
