"use client";

import { Breadcrumbs, Link, Typography } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useRouter } from "next/router";

export default function DynamicBreadcrumbs() {
  const router = useRouter();
  const path = router.pathname; // e.g. /admin/modules/venue/create

  // remove empty split results
  const segments = path.split("/").filter(Boolean);

  // build breadcrumb paths
  const paths = segments.map((_, idx) => `/${segments.slice(0, idx + 1).join("/")}`);

  return (
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      sx={{ mb: 2 }}
    >
      {/* Always show Dashboard as first */}
      <Link
        underline="hover"
        color="text.secondary"
        sx={{ cursor: "pointer" }}
        onClick={() => router.push("/admin")}
      >
        Dashboard
      </Link>

      {segments.slice(1).map((segment, index) => {
        const label = segment
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());

        const isLast = index === segments.length - 2;

        if (isLast) {
          return (
            <Typography key={segment} color="text.primary">
              {label}
            </Typography>
          );
        }

        return (
          <Link
            key={segment}
            underline="hover"
            color="text.secondary"
            sx={{ cursor: "pointer" }}
            onClick={() => router.push(paths[index + 1])}
          >
            {label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}
