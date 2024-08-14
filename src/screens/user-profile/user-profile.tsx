import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AvatarImg from '../../assets/img/avatar.jpg';
import UserContext from '../../context/user-context';
import UserService from '../../service/user.service';
import { biteCodeConvertIntoImg, notificationConfig } from '../../utils/util';
import "./user-profile.css";

const defaultTheme = createTheme();

export default function UserProfile() {
  const { user, updateUser } = useContext(UserContext);
  const [imagePreview, setImagePreview] = useState<any>();
  const [userDetails, setUserDetails] = useState<any>({
    first_name: '',
    last_name: '',
    userImg: ''
  })


  useEffect(() => {
    if (user !== null) {
      if (user.userImg !== null) {
        const getImage = biteCodeConvertIntoImg(user.userImg.data);
        setImagePreview(getImage);
        setUserDetails({
          first_name: user.first_name,
          last_name: user.last_name,
          userImg: getImage
        })
      } else {
        setUserDetails({
          first_name: user.first_name,
          last_name: user.last_name,
          userImg: ''
        })
      }
    }
    // eslint-disable-next-line
  }, [user])

  const handleSubmit = () => {
    const requestPayload = {
      first_name: userDetails.first_name,
      last_name: userDetails.last_name,
      userImg: imagePreview ? imagePreview : null
    }
    if (requestPayload.first_name !== '' && requestPayload.last_name !== '') {
      if (user.id) {
        UserService.updateProfile(user.id, requestPayload).then((res) => {
          updateUser();
          toast.success(res.data.message, notificationConfig);
        }).catch((error) => {
          toast.error(error.response.data.error, notificationConfig);
        })
      }
    }
  };

  const readURL = (input: any) => {
    const file = input.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (event: any) => {
        // Step 1: Convert ArrayBuffer to Uint8Array
        let TYPED_ARRAY = new Uint8Array(event.target.result);

        // Step 2: Convert typed array to string of characters
        const STRING_CHAR = TYPED_ARRAY.reduce((data, byte) => {
          return data + String.fromCharCode(byte);
        }, '');

        // Step 3: Obtain base64 string
        let base64String = btoa(STRING_CHAR);
        setImagePreview('data:image/' + file.type.split('/')[1] + ';base64,' + base64String)
      };

      reader.readAsArrayBuffer(file);
    }
  };

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    // Get the file extension
    const extension = file.name.split('.').pop().toLowerCase();
    // Check if the extension is allowed
    const maxSizeInBytes = 1048576; // 1MB in bytes
    if (!['jpg', 'jpeg', 'png'].includes(extension)) {
      toast.warning('Please select a valid JPG, PNG, or JPEG file.', notificationConfig);
    }

    // Check if file exceeds the maximum size
    if (['jpg', 'jpeg', 'png'].includes(extension) && file.size > maxSizeInBytes) {
      toast.warning('File size exceeds the maximum limit of 1MB. Please choose a smaller file.', notificationConfig);
      e.target.value = ''; // Clear the file input
      return;
    }

    readURL(e.target);
  };

  return (
    <div className="bottom-section-main">
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography className="title-text" component="h4">
              User Profile
            </Typography>
            <Box component="form" noValidate>
              <div className='user-profile-container'>
                <label htmlFor="imageUpload">
                  <input id="imageUpload" type="file" onChange={handleImageChange} accept=".png, .jpg, .jpeg" />
                  <img alt="avatar" id="avatar-preview" src={imagePreview ? imagePreview : AvatarImg} />
                </label>
              </div>
              <div className='image-warning'>Maximum upload image size: 1MB.</div>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    autoComplete="given-name"
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    value={userDetails.first_name}
                    onChange={(e) => setUserDetails({ ...userDetails, first_name: e.target.value })}
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    value={userDetails.last_name}
                    name="lastName"
                    autoComplete="family-name"
                    onChange={(e) => setUserDetails({ ...userDetails, last_name: e.target.value })}
                  />
                </Grid>
              </Grid>
              <Button
                fullWidth
                variant="contained"
                onClick={handleSubmit}
                sx={{ mt: 3, mb: 2 }}
              >
                Update
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
}