import { Container, Box } from "@mui/material";

export default function PageWrapper({ children }) {
  return (
    <Container>
      <Box sx={{ mt: 2 }}>
        {children}
      </Box>
    </Container>
  );
}
