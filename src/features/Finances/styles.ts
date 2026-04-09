export const headerStyle = {
  backgroundColor: "#08a810",
};

export const financePalette = {
  primary: "#08a810",
  primaryDark: "#059669",
  neutralBorder: "#e2e8f0",
  neutralSurface: "#f8fafc",
  neutralSoft: "#f1f5f9",
};

export const pagePanelCardSx = {
  p: 2,
  border: `1px solid ${financePalette.neutralBorder}`,
  borderRadius: "10px",
  backgroundColor: "#ffffff",
  boxShadow: "0 2px 6px rgba(15, 23, 42, 0.04)",
};

export const pageHeaderSx = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  mb: 2,
  pb: 1,
  position: "sticky",
  top: 0,
  backgroundColor: "transparent",
  zIndex: 10,
  borderBottom: "1px solid #ddd",
};

export const pageTopActionButtonSx = {
  mb: 2,
  px: 1.5,
  py: 0.5,
  fontSize: "0.8rem",
  fontWeight: 600,
  borderRadius: "10px",
  textTransform: "none",
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