import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import FooterDialog from "./shared/FooterDialog";

export default function PrivacyPolicy() {
  return (
    <FooterDialog button="Privacy Policy" title="Privacy Policy">
      <Typography sx={{ mb: 2 }}>
        All or partial advertising on this Website or App is managed by Playwire
        LLC. If Playwire publisher advertising services are used, Playwire LLC
        may collect and use certain aggregated and anonymized data for
        advertising purposes. To learn more about the types of data collected,
        how data is used and your choices as a user, please visit{" "}
        <Link href="https://www.playwire.com/privacy-policy">
          https://www.playwire.com/privacy-policy
        </Link>
        .
      </Typography>
      <Typography sx={{ mb: 2 }}>
        <Link href="http://www.playwire.com">
          <Box
            component="img"
            src="https://www.playwire.com/hubfs/Powered-by-Playwire-Badges/Ads-Powered-by-playwire-2021-standalone-large-300px.png"
            alt="Playwire"
            width="200"
            loading="lazy"
            sx={{ display: "block", mx: "auto" }}
          />
        </Link>
      </Typography>
      <Typography sx={{ mb: 2, textAlign: "center" }}>
        <Link href="https://www.playwire.com/contact-direct-sales">
          Advertise on this site.
        </Link>
      </Typography>
    </FooterDialog>
  );
}
