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
  borderRight: "1px solid #e0e0e0",
  "&:last-child": {
    borderRight: "none"
  }
};