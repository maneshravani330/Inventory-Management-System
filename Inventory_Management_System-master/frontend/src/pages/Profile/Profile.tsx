import React, { useState } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Grid,
  TextField,
  Button,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Paper,
  IconButton,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/apiService';

const Profile: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedUser({
      name: user?.name || '',
      email: user?.email || '',
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedUser({
      name: user?.name || '',
      email: user?.email || '',
    });
    setMessage(null);
  };

  const handleSave = async () => {
    if (!editedUser.name.trim() || !editedUser.email.trim()) {
      setMessage({ type: 'error', text: 'Name and email are required' });
      return;
    }

    if (!user?.id) {
      setMessage({ type: 'error', text: 'User ID not found' });
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.updateUser(user.id, {
        name: editedUser.name,
        email: editedUser.email,
      });
      
      if (response.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setIsEditing(false);
        
        // Refresh user data in the context
        await refreshUser();
      } else {
        setMessage({ type: 'error', text: response.message || 'Failed to update profile' });
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'All password fields are required' });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters long' });
      return;
    }

    if (!user?.id) {
      setMessage({ type: 'error', text: 'User ID not found' });
      return;
    }

    setLoading(true);
    try {
      // Note: For security reasons, we should validate the current password on the backend
      // For now, we'll just update with the new password
      const response = await apiService.updateUser(user.id, {
        password: passwordData.newPassword,
      });
      
      if (response.success) {
        setMessage({ type: 'success', text: 'Password changed successfully!' });
        setPasswordDialog(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setMessage({ type: 'error', text: response.message || 'Failed to change password' });
      }
    } catch (error) {
      console.error('Password change error:', error);
      setMessage({ type: 'error', text: 'Failed to change password. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role?.toUpperCase()) {
      case 'ADMIN':
        return 'error';
      case 'MANAGER':
        return 'warning';
      case 'USER':
        return 'info';
      default:
        return 'default';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography variant="h6">Loading profile...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', padding: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Profile Management
      </Typography>

      {message && (
        <Alert 
          severity={message.type} 
          sx={{ mb: 3 }}
          onClose={() => setMessage(null)}
        >
          {message.text}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Profile Overview Card */}
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  margin: '0 auto 16px',
                  fontSize: '2rem',
                  bgcolor: 'primary.main',
                }}
              >
                {getInitials(user.name)}
              </Avatar>
              <Typography variant="h5" gutterBottom>
                {user.name}
              </Typography>
              <Chip
                label={user.role}
                color={getRoleColor(user.role)}
                sx={{ mb: 2 }}
              />
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Profile Details Card */}
        <Grid item xs={12} md={8}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">Profile Information</Typography>
                {!isEditing ? (
                  <Button
                    startIcon={<EditIcon />}
                    variant="outlined"
                    onClick={handleEdit}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <Box>
                    <IconButton
                      onClick={handleSave}
                      disabled={loading}
                      color="primary"
                      sx={{ mr: 1 }}
                    >
                      <SaveIcon />
                    </IconButton>
                    <IconButton
                      onClick={handleCancel}
                      disabled={loading}
                    >
                      <CancelIcon />
                    </IconButton>
                  </Box>
                )}
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={isEditing ? editedUser.name : user.name}
                    onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                    disabled={!isEditing || loading}
                    InputProps={{
                      startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={isEditing ? editedUser.email : user.email}
                    onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                    disabled={!isEditing || loading}
                    type="email"
                    InputProps={{
                      startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Role"
                    value={user.role}
                    disabled
                    InputProps={{
                      startAdornment: <BadgeIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="User ID"
                    value={user.id}
                    disabled
                    InputProps={{
                      startAdornment: <BadgeIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Box>
                <Typography variant="h6" gutterBottom>
                  Security Settings
                </Typography>
                <Button
                  startIcon={<LockIcon />}
                  variant="outlined"
                  onClick={() => setPasswordDialog(true)}
                  disabled={loading}
                >
                  Change Password
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Account Statistics */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Account Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Box textAlign="center">
                  <Typography variant="h4" color="primary">
                    {user.id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    User ID
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box textAlign="center">
                  <Typography variant="h4" color="success.main">
                    Active
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Account Status
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box textAlign="center">
                  <Typography variant="h4" color="info.main">
                    {user.role}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Access Level
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Change Password Dialog */}
      <Dialog open={passwordDialog} onClose={() => setPasswordDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Current Password"
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="New Password"
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialog(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handlePasswordChange} variant="contained" disabled={loading}>
            {loading ? 'Changing...' : 'Change Password'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;
