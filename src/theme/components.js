// src/theme/components.js

const components = {
  MuiContainer: {
    defaultProps: {
      maxWidth: "xl",
    },
    styleOverrides: {
      root: {
        paddingTop: "24px",
        paddingBottom: "24px",
      },
    },
  },

  MuiButton: {
    defaultProps: {
      disableElevation: true,
    },
    styleOverrides: {
      root: {
        borderRadius: "8px",
        fontWeight: 600,
        textTransform: "none",
        paddingTop: 8,
        paddingBottom: 8,
      },

      // ✅ PRIMARY SOLID GOLD BUTTON
      containedPrimary: {
        backgroundColor: "#ffc108",  // solid gold
        color: "#000000",            // black text
        "&:hover": {
          backgroundColor: "#e0ac06", // slightly richer gold
        },
        "&:active": {
          backgroundColor: "#c99605",
        },
        "&.Mui-disabled": {
          backgroundColor: "#4a4300",
          color: "#2b2b2b",
        },
      },

      // ✅ OUTLINED PRIMARY (optional secondary style)
      outlinedPrimary: {
        borderColor: "#d4af37",
        color: "#d4af37",
        "&:hover": {
          borderColor: "#ffc108",
          backgroundColor: "rgba(255, 193, 8, 0.08)",
        },
      },
    },
  },

  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundColor: "#1a1a1a",
        borderRadius: 10,
      },
    },
  },

  MuiDrawer: {
    styleOverrides: {
      paper: {
        backgroundColor: "#0f0f0f",
        color: "#ffffff",
      },
    },
  },

  MuiListItemButton: {
    styleOverrides: {
      root: {
        borderRadius: 6,
        marginBottom: 4,
        paddingTop: 6,
        paddingBottom: 6,
        "&.Mui-selected": {
          backgroundColor: "rgba(255, 193, 8, 0.18)", // subtle gold highlight
          "&:hover": {
            backgroundColor: "rgba(255, 193, 8, 0.28)",
          },
        },
        "&:hover": {
          backgroundColor: "rgba(255, 193, 8, 0.12)",
        },
      },
    },
  },

  MuiListItemIcon: {
    styleOverrides: {
      root: {
        color: "#ffffff",
        minWidth: 36,
      },
    },
  },

  MuiListItemText: {
    styleOverrides: {
      primary: {
        fontSize: "0.8rem",
        fontWeight: 500,
      },
    },
  },

  // ✅ TEXT FIELD (Input) styling
MuiTextField: {
  defaultProps: {
    variant: "outlined",
    size: "small",
  },
},

MuiOutlinedInput: {
  styleOverrides: {
    root: {
      backgroundColor: "#1a1a1a",
      borderRadius: 8,
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#3a3a3a",
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "#ffc108",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#ffc108",
        boxShadow: "0 0 0 2px rgba(255, 193, 8, 0.25)",
      },
    },

    input: {
      color: "#ffffff",
      fontSize: "0.85rem",
      padding: "10px 12px",
      "&::placeholder": {
        color: "#9e9e9e",
        opacity: 1,
      },
    },
  },
},

// ✅ SELECT dropdown styling
MuiSelect: {
  styleOverrides: {
    outlined: {
      backgroundColor: "#1a1a1a",
      borderRadius: 8,
    },
    icon: {
      color: "#ffc108",
    },
  },
},

// ✅ MENU (dropdown list)
MuiMenu: {
  styleOverrides: {
    paper: {
      backgroundColor: "#1a1a1a",
      color: "#ffffff",
      borderRadius: 8,
    },
  },
},
MuiCard: {
  styleOverrides: {
    root: {
      backgroundColor: "#1a1a1a",
      borderRadius: 10,
      padding: "16px",
      border: "1px solid rgba(255, 255, 255, 0.06)",
      boxShadow: "0 2px 6px rgba(0,0,0,0.35)",
    },
  },
},

MuiCardHeader: {
  styleOverrides: {
    title: {
      fontSize: "1rem",
      fontWeight: 600,
      color: "#ffffff",
    },
    subheader: {
      color: "#b5b5b5",
      fontSize: "0.75rem",
    },
  },


  MuiTableHead: {
    styleOverrides: {
      root: {
        backgroundColor: "#151515",
      },
    },
  },
  
  MuiTableCell: {
    styleOverrides: {
      head: {
        color: "#ffc108",
        fontWeight: 600,
        fontSize: "0.75rem",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      },
      body: {
        color: "#e5e5e5",
        fontSize: "0.8rem",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      },
    },
  },
  
  MuiTableRow: {
    styleOverrides: {
      root: {
        "&:hover": {
          backgroundColor: "rgba(255,193,8,0.06)",
        },
        "&.Mui-selected": {
          backgroundColor: "rgba(255,193,8,0.14)",
        },
      },
    },
  },

  MuiChip: {
    styleOverrides: {
      root: {
        fontSize: "0.7rem",
        fontWeight: 500,
        borderRadius: 6,
      },
      colorPrimary: {
        backgroundColor: "#ffc108",
        color: "#000000",
      },
      colorSuccess: {
        backgroundColor: "#00c853",
        color: "#ffffff",
      },
      colorError: {
        backgroundColor: "#ff3b30",
        color: "#ffffff",
      },
      colorWarning: {
        backgroundColor: "#ff6f00",
        color: "#000000",
      },
    },
  },

  // ✅ DATA GRID PREMIUM STYLING
MuiDataGrid: {
  styleOverrides: {
    root: {
      border: "none",
      color: "#ffffff",
      fontSize: "0.8rem",
      backgroundColor: "#1a1a1a",
    },
    defaultProps: {
      density: "compact",
    },
    

    columnHeaders: {
      backgroundColor: "#151515",
      color: "#ffc108",
      fontWeight: 600,
      borderBottom: "1px solid rgba(255,255,255,0.08)",
    },

    row: {
      "&:hover": {
        backgroundColor: "rgba(255,193,8,0.06)",
      },
      "&.Mui-selected": {
        backgroundColor: "rgba(255,193,8,0.14)",
      },
    },

    cell: {
      borderBottom: "1px solid rgba(255,255,255,0.05)",
    },

    footerContainer: {
      backgroundColor: "#151515",
      borderTop: "1px solid rgba(255,255,255,0.08)",
    },

    iconSeparator: {
      display: "none",
    },
  },
},

  
},






};



export default components;
