import React, { useState }  from 'react';


import { useNavigate } from 'react-router-dom';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import { Avatar, Button, Container, Grid, TextField, Typography, AppBar, Toolbar } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import IconButton from '@mui/material/IconButton';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import AccessAlarmsOutlinedIcon from '@mui/icons-material/AccessAlarmsOutlined';

import Select,{ SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import parseISO from 'date-fns/parseISO'
import {format} from "date-fns";

import {appName} from './Globals.js';

import {get,post} from '../utils/requests'

import "../css/styles.css";
import {useEffect} from "react";


/*<---- disable back button of browser ---->*/
window.history.pushState(null, null, window.location.href);
window.onpopstate = function () {
    window.history.go(1);
};

const theme = createTheme();

const ProfileContainer = styled(Container)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: theme.spacing(4),
});

const ProfileAvatar = styled(Avatar)({
    width: theme.spacing(12),
    height: theme.spacing(12),
    marginBottom: theme.spacing(2),
});

const ProfileForm = styled('form')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(2),
    '& > *': {
        marginBottom: theme.spacing(2),
    },
});


  
const MyProfile = () => {

  const [active, setActive] = useState(false);
  const navigate = useNavigate();
  const [labelsData, setlabelsData] = useState([
							   {  id: 0, value: "Add new" },
								{ id: 1, value: "Study" },
								{ id: 2, value: "Meetings" }
  ]);
    const [selectedLabel, setSelectedLabel] = useState('Add new');
    const [selectedLabelID, setSelectedLabelID] = useState('0');


  const [data,setData] = useState({
      "firstName":"",
      "lastName":"",
      "gender":"male",
      "birthday":"",
      "email":""
  })
  const [oldData,setOldData] = useState({
      "firstName":"",
      "lastName":"",
      "gender":"",
      "birthday":"",
      "email":""})

/* After DOM is loaded, hide cancel button */
	useEffect(() => {
        get("/api/user/get/",{})
            .then(function (res){
                let data = res.data
                setData(data)
            })
    }, []);
  
 
 const handleLabelListChange = (event: SelectChangeEvent) => {
	 alert("label: "+event.target.value);
    setSelectedLabel(event.target.value);
  };
 
 

  const handleCancel = () => {
   // handle cancel button
   // Cancel editing
		if(active===true){
   	      setActive(!active);
		}
        setData(oldData);

  };

  const handleEdit = (event) => {

        setActive(!active);

		  if(active===false){ // Enable edit
                setOldData(data);
				setActive(!active);
		  }else{ // Save edits
              if(data.lastName==="" || data.firstName === "" || data.birthday === "" || data.email === ""){
                  alert("Please fill all fields");
                  handleCancel();
                  return;
              }
              console.log(data)
              post('/api/user/update/',data)
                  .then(function (res){
                      console.log("success");
					  alert("Saved!");
                  })  .catch(function (res){
					  console.log("Error : "+res)
					  alert("Saving failed, please try again !");

				  })
		  }

   
  };

  const handleHomeClick = () => {
    navigate('/home');
  };

  const handleLogoutClick = () => {
	  if (window.confirm('Are you sure you want to logout?')) 
	  {
		 navigate('/SignIn',true);
	  } 
   
  };
  
  /* Label update button click */
  const handleUpdate = (event) => {

		 
   
  };
  
  /* Label delete button click */
  const handleDelete = (event) => {
	  
	  console.log(labelsData);
	  console.log(selectedLabelID);

	 setlabelsData(labelsData.filter((item) => item.id !== {selectedLabelID})); // Not working

 	  console.log(labelsData);

		 
   
  };
  
  
  

  const textOnchange = (event) =>{
      console.log(event)
      const name = event.target.name;
      const value = event.target.value;
      setData({...data,[name] : value})
  }

  return (
    <ThemeProvider theme={theme}>
 <AppBar position="static">
  <Toolbar>
		<IconButton  color="inherit">
                <AccessAlarmsOutlinedIcon fontSize="large"/>
        </IconButton>
			
		<Typography
              component="h1"
			  fontFamily="Arial"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}>
            {appName}
        </Typography>
		
		<IconButton  color="inherit" onClick={handleHomeClick}>
            <HomeIcon fontSize="large"/>
        </IconButton>
			
		<IconButton color="inherit" onClick={handleLogoutClick}>
           <LogoutOutlinedIcon fontSize="large"/>
        </IconButton>
			
  </Toolbar>
</AppBar>
      <ProfileContainer maxWidth="sm" sx={{ textAlign: 'center' }}>
		
		{/* <ProfileAvatar src="/path/to/user/photo.jpg" alt="User's profile photo" />*/}
		<AccountCircleOutlinedIcon fontSize="large"/>
        <Typography variant="h4" gutterBottom fontFamily="Baskerville" sx={{ fontWeight: 600, mb: 2, fontSize: '2rem', color: 'cobalt'}}>
          My Profile
        </Typography>
		
        <ProfileForm onSubmit={handleEdit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth id="firstName" label="Firstname" name="firstName" value={data.firstName} onChange={textOnchange} disabled={!active}/>
			
            </Grid>
			 <Grid item xs={12} sm={6}>
              <TextField fullWidth id="lastName" label="Lastname" name="lastName" value={data.lastName} onChange={textOnchange} disabled={!active}/>
			
            </Grid>
           
            <Grid item xs={12} sm={6}>
				<Select required fullWidth defaultValue='male' value={data.gender} name="gender" onChange={textOnchange} label="gender" disabled={!active}>
					  <MenuItem value='male' >Male</MenuItem>
					  <MenuItem value='female' >Female</MenuItem>
				</Select>
            </Grid>
          <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                      id="birthday"
                      label="birthday"
					  maxDate={new Date()}
                      value={parseISO(data.birthday)}
                      onChange={(newValue) => setData({...data,birthday: format(newValue,"yyyy-MM-dd")})}
                      disabled={!active}
                   renderInput={(params) => <TextField {...params} />}/>
              </LocalizationProvider>
          </Grid>
          </Grid>
		   <Grid item xs={12} sm={6}>
              <TextField fullWidth id="email" label="Email" name="email" value={data.email} onChange={textOnchange} disabled={!active}/>
              
            </Grid>
			<br/>
         <div>
		 
 		 <Button id="edit" variant="contained" color="primary" fullWidth onClick={handleEdit} >
   		  { active ? "Save" : "Edit"}
 		 </Button>
             <Button id="cancel" variant="outlined" color="secondary" onClick={handleCancel} fullWidth style={{ borderColor: 'red', color: 'red', marginTop: '16px', display: active?'block':'none' }} >
  	 	 Cancel
  		</Button>

		</div>
	
		<div>
		-------------------------------------------------------------------------------------
			 <Typography variant="h6" gutterBottom fontFamily="Baskerville" sx={{ fontWeight: 400, mb: 2, fontSize: '2rem', color: 'cobalt'}}>
				Labels
			</Typography>
			
			   <Select sx={{ m: 1, width: 300 }}
				labelId="demo-multiple-name-label"
				id="demo-multiple-name"
				value={selectedLabel}
				onChange={handleLabelListChange}
				
			>
					{labelsData.map((label) => (
						<MenuItem
						key={label.id}
						value={label.value}
						 onClick={() => setSelectedLabelID(label.id)}
						>
							{label.value}
						</MenuItem>
					))}
			  </Select> 
			<TextField sx={{ m: 1, width: 300 }} id="labelUpdate" label={selectedLabel} variant="outlined" />
			 <br/><Button sx={{ m: 1, width: 150 }} variant="contained" color="primary" onClick={handleUpdate} >
				Update
			</Button>
			 <Button sx={{ m: 1, width: 150 }} variant="contained" color="primary" onClick={handleDelete} >
				Delete
			</Button>
			<br/>
		</div>
	
		<br/>
        </ProfileForm>
		
      </ProfileContainer>
    </ThemeProvider>
  );


}
export default MyProfile;

