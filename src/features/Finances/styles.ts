export const headerStyle = {
  backgroundColor: "#08a810",
};

export const headerCellStyle = {
  color: "white",
  fontWeight: "bold",
};

export const editableCell = {
  cursor: "pointer",
  userSelect: "none",
  "&:hover": {
    backgroundColor: "#eef7ff",
  },
  padding: "4px 8px !important",
};

export const editingCell = {
  backgroundColor: "#fff7cc",
  padding: "0 !important",
  margin: 0,
};

export const cellWithDivider = {
  borderRight: "0.5px solid #e8e8e8",
  "&:last-child": {
    borderRight: "none"
  }
};

export const thinTableLines = {
  "& .MuiTableCell-root": {
    borderBottom: "0.5px solid #e8e8e8",
  },
};