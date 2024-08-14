import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { Autocomplete, Checkbox } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import GroupService from '../../service/group.service';
import TournamentService from '../../service/tournament.service';
import UserService from '../../service/user.service';
import { ITournament } from '../../types/tournament';
import { IUser } from '../../types/user';
import { notificationConfig } from '../../utils/util';

const defaultTheme = createTheme();
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function AddGroup() {
  const navigate = useNavigate();
  const { id }: any = useParams();
  const [userList, setUserList] = useState([]);
  const [tournamentList, setTournamentList] = useState([]);
  const [tournamentFieldDisable, setTournamentFieldDisable] = useState(false);
  const [userFieldDisable, setUserFieldDisable] = useState(false);
  const [groupData, setGroupData] = useState({
    name: "",
    description: "",
    tournaments: [],
    users: []
  })

  useEffect(() => {
    if (id !== "add-group" && id !== undefined) {
      GroupService.get(id).then((res) => {
        const group = res.data;
        setGroupData({
          name: group.name,
          description: group.description,
          tournaments: group.tournaments,
          users: group.users
        })
      }).catch((error) => console.error(error))
    }

    getGroupsList();
    getTournamentList();
    // eslint-disable-next-line
  }, [id])

  const getGroupsList = () => {
    UserService.getUsers().then((res) => {
      if (res.data.length === 0) {
        setUserFieldDisable(true);
      } else {
        setUserFieldDisable(false);
      }
      if (res.data) {
        setUserList(res.data);
      }
    }).catch((error) => {
      console.error(error);
    })
  }

  const getTournamentList = () => {
    TournamentService.getByUserAll(null).then((res) => {
      if (res.data.length === 0) {
        setTournamentFieldDisable(true);
      } else {
        setTournamentFieldDisable(false);
      }
      if (res.data) {
        setTournamentList(res.data);
      }
    }).catch((error) => {
      console.error(error);
    })
  }

  const handleSubmit = () => {
    if (id !== "add-group" && id !== undefined) {
      GroupService.update(id, groupData).then((res) => {
        toast.success(res.data.message, notificationConfig);
        navigate('/groups')
      }).catch((error) => {
        toast.error(error.response.data.error, notificationConfig);
      })
    } else {
      GroupService.create(groupData).then((res) => {
        toast.success(res.data.message, notificationConfig);
        navigate('/groups')
      }).catch((error) => {
        toast.error(error.response.data.error, notificationConfig);
      })
    }
  };

  return (
    <div className="bottom-section-main bg">
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
            <Box component="form" noValidate sx={{ marginTop: "40px !important", marginBottom: "40px !important" }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    autoComplete="given-name"
                    name="name"
                    required
                    fullWidth
                    id="name"
                    label="Name"
                    value={groupData.name}
                    onChange={(e) => setGroupData({ ...groupData, name: e.target.value })}
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    autoComplete="given-description"
                    name="description"
                    required
                    fullWidth
                    id="description"
                    label="Description"
                    value={groupData.description}
                    onChange={(e) => setGroupData({ ...groupData, description: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    className='multi-select-box-width'
                    id="checkboxes-tags-demo"
                    options={tournamentList}
                    disableCloseOnSelect
                    onChange={(event: any, values: any) => setGroupData({ ...groupData, tournaments: values })}
                    value={groupData.tournaments}
                    disabled={tournamentFieldDisable}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    getOptionLabel={(option: ITournament) => option.name ? option.name : ''}
                    renderOption={(props, option, { selected }) => (
                      <li {...props}>
                        <Checkbox
                          icon={icon}
                          checkedIcon={checkedIcon}
                          style={{ marginRight: 8 }}
                          checked={selected}
                        />
                        {option.name ? option.name : ''}
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField {...params} label="Tournaments" placeholder="Tournaments" />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    id="checkboxes-tags-demo"
                    className='multi-select-box-width'
                    options={userList}
                    disableCloseOnSelect
                    onChange={(event: any, values: any) => setGroupData({ ...groupData, users: values })}
                    value={groupData.users}
                    disabled={userFieldDisable}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    getOptionLabel={(option: IUser) => option.first_name && option.last_name ? option.first_name + ' ' + option.last_name : ''}
                    renderOption={(props, option, { selected }) => (
                      <li {...props}>
                        <Checkbox
                          icon={icon}
                          checkedIcon={checkedIcon}
                          style={{ marginRight: 8 }}
                          checked={selected}
                        />
                        {option.first_name && option.last_name ? option.first_name + ' ' + option.last_name : ''}
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField {...params} label="Users" placeholder="Users" />
                    )}
                  />
                </Grid>
                <Grid item xs={12} style={{ display: "flex", justifyContent: "space-between" }}>
                  <Button variant="contained" color='inherit' onClick={() => navigate('/groups')} >Back</Button>
                  <Button variant="contained" className='btn' onClick={handleSubmit} disabled={!groupData.name}>{id !== 'add-group' && id !== undefined ? 'Update' : 'Add'}</Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
}