import React, { useState, useEffect } from "react";
import { Fetching } from "../../components/Fetching";
import { Box, Typography } from "@mui/material";
import * as Sentry from "@sentry/react";

export const GeoLocation = () => {
  const [lat, setLat] = useState<any>(null);
  const [lng, setLng] = useState<any>(null);
  const [status, setStatus] = useState<any>("checking");
  const [message, setMessage] = useState<any>("");

  const getLocation = async () => {
    if (!navigator.geolocation) {
      setStatus("error");
      setMessage("Your browser does not support geo location.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (
          !position ||
          !position.coords ||
          !position.coords.latitude ||
          !position.coords.longitude
        ) {
          setStatus("error");
          setMessage("No coordinates were returned.");
          const lat = position.coords.latitude
            ? position.coords.latitude
            : null;
          const long = position.coords.longitude
            ? position.coords.longitude
            : null;
          console.log(
            `Position coords are not defined, lat: ${lat}, long: ${long}`
          );
          Sentry.captureException(
            new Error(
              `Position coords are not defined, lat: ${lat}, long: ${long}`
            )
          );
          return;
        }

        setLat(position.coords.latitude);
        setLng(position.coords.longitude);
        setStatus("success");
        setMessage(`Coordinates found`);
      },
      (error) => {
        setStatus("error");
        setMessage(`Error getting location. ${error.message}`);
        console.log(`Error occurred trying to get location. ${error.message}`);
        Sentry.captureException(error);
      },
      { enableHighAccuracy: false, timeout: 30000, maximumAge: 300000 }
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <>
      {status === "checking" ? (
        <Box sx={{ m: 2 }}>
          {" "}
          <Fetching />
        </Box>
      ) : status !== "error" ? (
        <Typography
          sx={{
            color: "#2B262C",
            fontSize: "15px",
            fontWeight: "600",
            pl: "5px",
            mt: "12px",
            mb: "5px",
          }}
        >
          {message}
          <Typography
            sx={{
              color: "#7C7A80",
              fontSize: "15px",
              fontWeight: "600",
              pl: "5px",
              mb: "5px",
            }}
          >
            {lat}
          </Typography>
          <Typography
            sx={{
              color: "#7C7A80",
              fontSize: "15px",
              fontWeight: "600",
              pl: "5px",
              mb: "5px",
            }}
          >
            {lng}
          </Typography>
        </Typography>
      ) : null}
      {status === "error" ? (
        <Box sx={{ m: 2 }}>
          <Typography variant="h6" color="error">
            Please enable location services.
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            {message}
          </Typography>
          <a
            href="https://support.apple.com/en-us/HT204690"
            target="_blank"
            rel="noreferrer"
          >
            Click here for more info.
          </a>
        </Box>
      ) : null}
    </>
  );
};
