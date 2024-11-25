import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Input,
} from "@material-tailwind/react";
import axios from "axios";
import axiosInstance from "@/api/baseUrlConfig";

const RestaurantBulkUpload = ({ apiEndpoint }) => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadStatus("");
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus("Please select a file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    setUploadStatus("");

    try {
      const response = await axiosInstance.post('/admin/upload-restaurants-by-excel', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUploadStatus(`Upload successful: ${response.message}`);
    } catch (error) {
      setUploadStatus(
        `Upload failed: ${JSON.stringify(response.results) || error.message}`
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="flex flex-row w-full max-w-4xl mx-auto mt-8 items-center">
      <CardBody className="flex flex-col w-2/3 pr-6">
        <Typography variant="h4" className="mb-4">
          Bulk Upload Restaurants
        </Typography>
        <Typography variant="small" color="gray" className="mb-6">
          Upload an Excel sheet to add restaurants to the database.
        </Typography>
        <Input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          disabled={isUploading}
          className="mb-4"
        />
        {uploadStatus && (
          <Typography
            variant="small"
            color={uploadStatus.startsWith("Upload successful") ? "green" : "red"}
            className="mb-4"
          >
            {uploadStatus}
          </Typography>
        )}
      </CardBody>
      <CardFooter className="w-1/3 flex flex-col items-center justify-center">
        <Button
          onClick={handleUpload}
          disabled={!file || isUploading}
          fullWidth
          className="mb-4"
        >
          {isUploading ? "Uploading..." : "Upload File"}
        </Button>
        <Typography variant="small" color="blue-gray" className="text-center">
          Ensure the file is in .xlsx or .xls format.
        </Typography>
      </CardFooter>
    </Card>
  );
};

export default RestaurantBulkUpload;