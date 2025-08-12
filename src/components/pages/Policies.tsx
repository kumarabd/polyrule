import React from 'react';
import {
  Container, Typography, Paper, Box, Tabs, Tab, Button, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle, TextField, IconButton, Card,
  CardContent, CardActions, Chip, Menu, MenuItem, ListItemIcon,
  Accordion, AccordionSummary, AccordionDetails, Alert, Snackbar,
  Breadcrumbs, Link
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  ExpandMore as ExpandMoreIcon,
  Security as SecurityIcon,
  Business as BusinessIcon,
  Shield as ShieldIcon,
  VpnKey as VpnKeyIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Gavel as GavelIcon,
  Settings as SettingsIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';

// Import custom hooks
import { usePolicySets, policySetTypes, PolicySet, Policy } from '../../hooks/usePolicySets';
import { usePolicyUIState } from '../../hooks/usePolicyUIState';

const Policies: React.FC = () => {
  // Use custom hooks for policy sets data and UI state management
  const { policySets, snackbar, createPolicySet, updatePolicySet, deletePolicySet, createPolicy, updatePolicy, deletePolicy, closeSnackbar } = usePolicySets();
  
  const {
    // Selected policy set for viewing details
    selectedPolicySetId,
    viewPolicySet,
    backToPolicySets,
    
    // Tab state
    selectedTab,
    setSelectedTab,
    
    // Dialog states
    openCreateDialog,
    openEditDialog,
    openDeleteDialog,
    openPolicyDialog,
    openPolicyDeleteDialog,
    
    // Form inputs
    formInputs,
    policyFormInputs,
    handleFormInputChange,
    handlePolicyFormInputChange,
    
    // Current selections
    currentPolicySet,
    currentPolicy,
    
    // Dialog actions
    openCreatePolicySetDialog,
    openEditPolicySetDialog,
    openDeletePolicySetDialog,
    openCreatePolicyDialog,
    openEditPolicyDialog,
    openDeletePolicyDialog,
    closeDialogs,
    
    // Menu handlers
    menuAnchors,
    handleMenuOpen,
    handleCloseMenu
  } = usePolicyUIState();

  // Get icon component for policy set type
  const getPolicySetIcon = (type: string) => {
    switch (type) {
      case 'authorization':
        return <VpnKeyIcon />;
      case 'firewall':
        return <ShieldIcon />;
      case 'business':
        return <BusinessIcon />;
      case 'compliance':
        return <GavelIcon />;
      case 'custom':
        return <SettingsIcon />;
      default:
        return <SecurityIcon />;
    }
  };

  // Handle snackbar close
  const handleSnackbarClose = closeSnackbar;

  // Handle policy set save
  const handlePolicySetSave = (): void => {
    if (currentPolicySet) {
      // Update existing policy set
      updatePolicySet(currentPolicySet.id, formInputs);
    } else {
      // Create new policy set
      createPolicySet(formInputs);
    }
    closeDialogs();
  };

  // Handle policy save
  const handlePolicySave = (): void => {
    if (currentPolicy && selectedPolicySetId) {
      // Update existing policy
      updatePolicy(selectedPolicySetId, currentPolicy.id, policyFormInputs);
    } else if (selectedPolicySetId) {
      // Create new policy
      createPolicy(selectedPolicySetId, policyFormInputs);
    }
    closeDialogs();
  };

  // Handle policy set delete
  const handlePolicySetDelete = (): void => {
    if (currentPolicySet) {
      deletePolicySet(currentPolicySet.id);
    }
    closeDialogs();
  };
  
  // Handle policy delete
  const handlePolicyDelete = (): void => {
    if (currentPolicy && selectedPolicySetId) {
      deletePolicy(selectedPolicySetId, currentPolicy.id);
    }
    closeDialogs();
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {selectedPolicySetId ? (
        // Policy Set Detail View - Show policies for the selected policy set
        <>
          {/* Breadcrumb navigation */}
          <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
            <Link
              underline="hover"
              color="inherit"
              sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              onClick={backToPolicySets}
            >
              <ArrowBackIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              Policy Sets
            </Link>
            <Typography color="text.primary">
              {policySets.find(ps => ps.id === selectedPolicySetId)?.name || 'Policy Set Details'}
            </Typography>
          </Breadcrumbs>
          
          {/* Policy Set Details */}
          <Paper sx={{ p: 3, mb: 3 }}>
            {/* Selected policy set header */}
            {policySets.map(policySet => policySet.id === selectedPolicySetId && (
              <Box key={policySet.id}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getPolicySetIcon(policySet.type)}
                    <Typography variant="h4">{policySet.name}</Typography>
                  </Box>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<AddIcon />} 
                    onClick={() => openCreatePolicyDialog(policySet.id)}
                  >
                    New Policy
                  </Button>
                </Box>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {policySet.description}
                </Typography>
                <Chip 
                  label={policySetTypes.find(t => t.value === policySet.type)?.label || 'Custom'}
                  size="small"
                  sx={{ mb: 3 }}
                />

                {/* Policies List */}
                {policySet.policies.length === 0 ? (
                  <Box sx={{ p: 3, textAlign: 'center', bgcolor: 'background.paper', borderRadius: 1 }}>
                    <Typography variant="h6">No Policies Yet</Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Create your first policy for this policy set
                    </Typography>
                    <Button 
                      variant="outlined" 
                      startIcon={<AddIcon />} 
                      onClick={() => openCreatePolicyDialog(policySet.id)}
                    >
                      Add First Policy
                    </Button>
                  </Box>
                ) : (
                  <Box>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Policies ({policySet.policies.length})
                    </Typography>
                    {policySet.policies.map(policy => (
                      <Accordion key={policy.id}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', pr: 2 }}>
                            <Typography>{policy.name}</Typography>
                            <Chip 
                              label={policy.status} 
                              color={policy.status === 'active' ? 'success' : 'default'}
                              size="small"
                            />
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography paragraph>{policy.description}</Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                            <Button
                              size="small"
                              startIcon={<EditIcon />}
                              onClick={() => openEditPolicyDialog(policySet.id, policy)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="small"
                              color="error"
                              startIcon={<DeleteIcon />}
                              onClick={() => openDeletePolicyDialog(policySet.id, policy)}
                            >
                              Delete
                            </Button>
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </Box>
                )}
              </Box>
            ))}
          </Paper>
        </>
      ) : (
        // Policy Sets List View - Show all policy sets
        <>
          {/* Page header */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h4" gutterBottom>Policy Sets</Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Manage your organization's policy sets for different use cases.
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<AddIcon />} 
              onClick={openCreatePolicySetDialog}
            >
              New Policy Set
            </Button>
          </Paper>
          
          {/* Tabs for filtering policy sets by type */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs 
              value={selectedTab} 
              onChange={(e, newValue) => setSelectedTab(newValue)} 
              aria-label="policy set type tabs"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="All" />
              {policySetTypes.map((type, index) => (
                <Tab 
                  key={type.value} 
                  label={type.label} 
                  icon={getPolicySetIcon(type.value)} 
                  iconPosition="start"
                />
              ))}
            </Tabs>
          </Box>

          {/* Policy Sets Grid */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
            {policySets
              .filter(policySet => selectedTab === 0 || policySetTypes[selectedTab - 1]?.value === policySet.type)
              .map(policySet => (
                <Box key={policySet.id}>
                  <Card>
                    <CardContent sx={{ pb: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getPolicySetIcon(policySet.type)}
                          <Typography variant="h6">{policySet.name}</Typography>
                        </Box>
                        <IconButton
                          aria-label="policy set options"
                          onClick={(e) => handleMenuOpen(e, policySet.id)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Box>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {policySet.description}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Chip 
                          label={policySetTypes.find(t => t.value === policySet.type)?.label || 'Custom'}
                          size="small"
                        />
                        <Typography variant="body2">
                          {policySet.policies.length} {policySet.policies.length === 1 ? 'Policy' : 'Policies'}
                        </Typography>
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button 
                        size="small" 
                        onClick={() => viewPolicySet(policySet.id)}
                      >
                        View Policies
                      </Button>
                    </CardActions>
                  </Card>
                </Box>
              ))}
          </Box>
        </>
      )}
      
      {/* Policy Set Menus */}
      {policySets.map(policySet => (
        <Menu
          key={`menu-${policySet.id}`}
          id={`menu-${policySet.id}`}
          anchorEl={menuAnchors[policySet.id]}
          open={Boolean(menuAnchors[policySet.id])}
          onClose={() => handleCloseMenu(policySet.id)}
        >
          <MenuItem onClick={() => openEditPolicySetDialog(policySet)}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            Edit Policy Set
          </MenuItem>
          <MenuItem onClick={() => openDeletePolicySetDialog(policySet)}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            Delete Policy Set
          </MenuItem>
        </Menu>
      ))}

      {/* Create/Edit Policy Set Dialog */}
      <Dialog open={openCreateDialog || openEditDialog} onClose={closeDialogs}>
        <DialogTitle>{currentPolicySet ? 'Edit Policy Set' : 'New Policy Set'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            name="name"
            label="Policy Set Name"
            type="text"
            fullWidth
            variant="outlined"
            value={formInputs.name}
            onChange={handleFormInputChange}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            margin="dense"
            id="description"
            name="description"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={formInputs.description}
            onChange={handleFormInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            select
            id="type"
            name="type"
            label="Policy Set Type"
            value={formInputs.type}
            onChange={handleFormInputChange}
            fullWidth
            variant="outlined"
          >
            {policySetTypes.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button onClick={closeDialogs} color="inherit" startIcon={<CancelIcon />}>
            Cancel
          </Button>
          <Button 
            onClick={handlePolicySetSave} 
            color="primary" 
            variant="contained"
            startIcon={<SaveIcon />}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Policy Set Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={closeDialogs}>
        <DialogTitle>Delete Policy Set</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the policy set "{currentPolicySet?.name}"? 
            This will also delete all associated policies. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button onClick={closeDialogs} color="inherit">
            Cancel
          </Button>
          <Button onClick={handlePolicySetDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create/Edit Policy Dialog */}
      <Dialog open={openPolicyDialog} onClose={closeDialogs}>
        <DialogTitle>{currentPolicy ? 'Edit Policy' : 'New Policy'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            name="name"
            label="Policy Name"
            type="text"
            fullWidth
            variant="outlined"
            value={policyFormInputs.name}
            onChange={handlePolicyFormInputChange}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            margin="dense"
            id="description"
            name="description"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={policyFormInputs.description}
            onChange={handlePolicyFormInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            select
            id="status"
            name="status"
            label="Status"
            value={policyFormInputs.status}
            onChange={handlePolicyFormInputChange}
            fullWidth
            variant="outlined"
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="draft">Draft</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button onClick={closeDialogs} color="inherit" startIcon={<CancelIcon />}>
            Cancel
          </Button>
          <Button 
            onClick={handlePolicySave} 
            color="primary" 
            variant="contained"
            startIcon={<SaveIcon />}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Policy Confirmation Dialog */}
      <Dialog open={openPolicyDeleteDialog} onClose={closeDialogs}>
        <DialogTitle>Delete Policy</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the policy "{currentPolicy?.name}"? 
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button onClick={closeDialogs} color="inherit">
            Cancel
          </Button>
          <Button onClick={handlePolicyDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Policies;
