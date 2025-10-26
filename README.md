# IceReporter

This project is designed to assist people in reporting civil rights violations, specificially about Immigration Control Enforcment agents.  

## Structure
The front end is Angular 17 and the backend is a C# WebApi server  (not included in this repo).  

## Data Validation
In addition to the contact information, images and descriptions, we pull the meta data from the image as well as whatever other data we can get about the GPS coordinates to validate that the image actually is legitamate

## Result Set
The API server accepts a post of the images and the form contents, then produces a PDF document in a format that can be used for submitting a complaint to the DoJ as well as to attornies at the ACLU.  The PDF will have embedded images on 
the primary page as well as stretched out to larger sizes on the following pages.  Each file will have a reference ID to the original which will be maintained in a secure cloud folder.

## Storage
We store the original images with a SHA-256 encoding (to prove that they have not been altered since uploaded) in a folder in an Azure data container, but defined solely as a UUID.  That UUID is attached to the PDF report sent to the ACLU.  
if they require the original images, we can provide them.

## Future
The API server is currently in development.  Ideally, we will be able to choose any cloud service or a local directory to store the image - OR simply email them to the user and allow the ACLU attorny to contact them for the file.

## Modifications
Feel free to modify the hell out of this.  It's just a side project and if it helps you, feel free to use it.