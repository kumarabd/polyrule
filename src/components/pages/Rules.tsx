import React, { MouseEvent } from 'react';
import {
  Container, Typography, Paper, Box, Tabs, Tab, Button, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle, TextField, IconButton, Card,
  CardContent, CardActions, Chip, Menu, MenuItem, ListItemIcon,
  Accordion, AccordionSummary, AccordionDetails, List, ListItem,
  Alert, Snackbar, Breadcrumbs, Link, FormControl, InputLabel, Select,
  SelectChangeEvent
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  ExpandMore as ExpandMoreIcon,
  Security as SecurityIcon,
  Gavel as GavelIcon,
  Code as CodeIcon,
  Notifications as NotificationsIcon,
  Route as RouteIcon,
  Settings as SettingsIcon,
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Flag as FlagIcon
} from '@mui/icons-material';

// Import custom hooks
import { useRuleSets, ruleSetTypes, RuleSet, Rule } from '../../hooks/useRuleSets';
import { useRuleUIState } from '../../hooks/useRuleUIState';

const Rules: React.FC = () => {
  // Use custom hooks for rule sets data and UI state management
  const { 
    ruleSets, 
    snackbar, 
    createRuleSet, 
    updateRuleSet, 
    deleteRuleSet, 
    createRule, 
    updateRule, 
    deleteRule, 
    getRuleSetIconName,
    closeSnackbar 
  } = useRuleSets();
  
  const {
    // Selected rule set for viewing details
    selectedRuleSetId,
    viewRuleSet,
    backToRuleSets,
    
    // Tab state
    selectedTab,
    setSelectedTab,
    
    // Dialog states
    openCreateDialog,
    openEditDialog,
    openDeleteDialog,
    openRuleDialog,
    openRuleDeleteDialog,
    
    // Form inputs
    formInputs,
    ruleFormInputs,
    handleFormInputChange,
    handleRuleFormInputChange,
    
    // Current selections
    currentRuleSet,
    currentRule,
    
    // Dialog actions
    openCreateRuleSetDialog,
    openEditRuleSetDialog,
    openDeleteRuleSetDialog,
    openCreateRuleDialog,
    openEditRuleDialog,
    openDeleteRuleDialog,
    closeDialogs,
    
    // Menu handlers
    menuAnchors,
    handleMenuOpen,
    handleCloseMenu
  } = useRuleUIState();

  // Filter rule sets based on selected tab
  const filterRuleSetsByTab = (): RuleSet[] => {
    if (selectedTab === 0) return ruleSets; // All
    const selectedType = ruleSetTypes[selectedTab - 1]?.value;
    return ruleSets.filter(rs => rs.type === selectedType);
  };

  // Get rule set by ID
  const getRuleSetById = (id: string): RuleSet | undefined => {
    return ruleSets.find(rs => rs.id === id);
  };

  // Get icon component based on rule set type
  const getRuleSetIcon = (type: string) => {
    const iconName = getRuleSetIconName(type);
    switch (iconName) {
      case 'security':
        return <SecurityIcon />;
      case 'gavel':
        return <GavelIcon />;
      case 'code':
        return <CodeIcon />;
      case 'notifications':
        return <NotificationsIcon />;
      case 'route':
        return <RouteIcon />;
      default:
        return <SettingsIcon />;
    }
  };
  
  // Get severity color
  const getSeverityColor = (severity: string): 'error' | 'warning' | 'success' | 'primary' => {
    switch (severity) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'primary';
    }
  };

  // Handle create rule set
  const handleCreateRuleSet = (): void => {
    createRuleSet(formInputs);
    closeDialogs();
  };

  // Handle update rule set
  const handleUpdateRuleSet = (): void => {
    if (currentRuleSet) {
      updateRuleSet(currentRuleSet.id, formInputs);
      closeDialogs();
    }
  };

  // Handle delete rule set
  const handleDeleteRuleSet = (): void => {
    if (currentRuleSet) {
      deleteRuleSet(currentRuleSet.id);
      closeDialogs();
    }
  };

  // Handle create rule
  const handleCreateRule = (): void => {
    if (selectedRuleSetId) {
      createRule(selectedRuleSetId, ruleFormInputs);
      closeDialogs();
    }
  };

  // Handle update rule
  const handleUpdateRule = (): void => {
    if (selectedRuleSetId && currentRule) {
      updateRule(selectedRuleSetId, currentRule.id, ruleFormInputs);
      closeDialogs();
    }
  };

  // Handle delete rule
  const handleDeleteRule = (): void => {
    if (selectedRuleSetId && currentRule) {
      deleteRule(selectedRuleSetId, currentRule.id);
      closeDialogs();
    }
  };

  // Rule Set List View
  const renderRuleSetsList = () => (
    <>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Rule Sets
        </Typography>
        <Typography variant="body1" paragraph>
          Manage your rule sets for different purposes such as alerting, routing, security, compliance, and development.
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Tabs 
            value={selectedTab} 
            onChange={(e, newValue) => setSelectedTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="All" />
            {ruleSetTypes.map((type) => (
              <Tab key={type.value} label={type.label} />
            ))}
          </Tabs>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={openCreateRuleSetDialog}
          >
            Add Rule Set
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
        {filterRuleSetsByTab().map((ruleSet) => (
          <Box key={ruleSet.id}>
            <Card elevation={2}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ mr: 1 }}>
                    {getRuleSetIcon(ruleSet.type)}
                  </Box>
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    {ruleSet.name}
                  </Typography>
                  <IconButton 
                    size="small"
                    onClick={(e: MouseEvent<HTMLButtonElement>) => handleMenuOpen(ruleSet.id, e)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    id={`menu-${ruleSet.id}`}
                    anchorEl={menuAnchors[ruleSet.id]}
                    open={Boolean(menuAnchors[ruleSet.id])}
                    onClose={() => handleCloseMenu(ruleSet.id)}
                  >
                    <MenuItem onClick={() => {
                      handleCloseMenu(ruleSet.id);
                      openEditRuleSetDialog(ruleSet);
                    }}>
                      <ListItemIcon>
                        <EditIcon fontSize="small" />
                      </ListItemIcon>
                      Edit
                    </MenuItem>
                    <MenuItem onClick={() => {
                      handleCloseMenu(ruleSet.id);
                      openDeleteRuleSetDialog(ruleSet);
                    }}>
                      <ListItemIcon>
                        <DeleteIcon fontSize="small" />
                      </ListItemIcon>
                      Delete
                    </MenuItem>
                  </Menu>
                </Box>
                <Chip 
                  label={ruleSetTypes.find(t => t.value === ruleSet.type)?.label || ruleSet.type} 
                  size="small" 
                  sx={{ mb: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {ruleSet.description}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {ruleSet.rules.length} rule{ruleSet.rules.length !== 1 ? 's' : ''}
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  onClick={() => viewRuleSet(ruleSet.id)}
                >
                  View Rules
                </Button>
              </CardActions>
            </Card>
          </Box>
        ))}
      </Box>
    </>
  );

  // Rule Set Detail View with Rules
  const renderRuleSetDetail = () => {
    const ruleSet = getRuleSetById(selectedRuleSetId || '');
    if (!ruleSet) return null;
    
    return (
      <>
        <Box sx={{ mb: 3 }}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link 
              underline="hover" 
              color="inherit" 
              sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              onClick={backToRuleSets}
            >
              <ArrowBackIcon fontSize="small" sx={{ mr: 0.5 }} />
              Rule Sets
            </Link>
            <Typography color="text.primary">{ruleSet.name}</Typography>
          </Breadcrumbs>
        </Box>
        
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ mr: 1 }}>
                  {getRuleSetIcon(ruleSet.type)}
                </Box>
                <Typography variant="h4" component="h1">
                  {ruleSet.name}
                </Typography>
              </Box>
              <Chip 
                label={ruleSetTypes.find(t => t.value === ruleSet.type)?.label || ruleSet.type} 
                size="small" 
                sx={{ mb: 1 }}
              />
              <Typography variant="body1">
                {ruleSet.description}
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => openCreateRuleDialog(selectedRuleSetId || '')}
            >
              Add Rule
            </Button>
          </Box>
          
          {ruleSet.rules.length === 0 ? (
            <Alert severity="info" sx={{ mt: 2 }}>
              No rules found in this rule set. Click the Add Rule button to create one.
            </Alert>
          ) : (
            <List sx={{ mt: 3 }}>
              {ruleSet.rules.map((rule) => (
                <React.Fragment key={rule.id}>
                  <ListItem alignItems="flex-start" sx={{ p: 0 }}>
                    <Accordion sx={{ width: '100%' }}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`panel-${rule.id}-content`}
                        id={`panel-${rule.id}-header`}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                          <Typography sx={{ flexGrow: 1, fontWeight: 500 }}>{rule.title}</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Chip 
                              label={rule.severity} 
                              color={getSeverityColor(rule.severity)} 
                              size="small" 
                              sx={{ mr: 1 }}
                              icon={<FlagIcon />}
                            />
                            <IconButton 
                              size="small" 
                              onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                e.stopPropagation();
                                handleMenuOpen(`rule-${rule.id}`, e);
                              }}
                            >
                              <MoreVertIcon />
                            </IconButton>
                          </Box>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography variant="body1">{rule.description}</Typography>
                      </AccordionDetails>
                    </Accordion>
                    <Menu
                      id={`menu-rule-${rule.id}`}
                      anchorEl={menuAnchors[`rule-${rule.id}`]}
                      open={Boolean(menuAnchors[`rule-${rule.id}`])}
                      onClose={() => handleCloseMenu(`rule-${rule.id}`)}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MenuItem onClick={() => {
                        handleCloseMenu(`rule-${rule.id}`);
                        openEditRuleDialog(rule);
                      }}>
                        <ListItemIcon>
                          <EditIcon fontSize="small" />
                        </ListItemIcon>
                        Edit
                      </MenuItem>
                      <MenuItem onClick={() => {
                        handleCloseMenu(`rule-${rule.id}`);
                        openDeleteRuleDialog(rule);
                      }}>
                        <ListItemIcon>
                          <DeleteIcon fontSize="small" />
                        </ListItemIcon>
                        Delete
                      </MenuItem>
                    </Menu>
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          )}
        </Paper>
      </>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {selectedRuleSetId ? renderRuleSetDetail() : renderRuleSetsList()}
      
      {/* Create/Edit Rule Set Dialog */}
      <Dialog 
        open={openCreateDialog || openEditDialog} 
        onClose={closeDialogs}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {currentRuleSet ? 'Edit Rule Set' : 'Create Rule Set'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            name="name"
            label="Rule Set Name"
            type="text"
            fullWidth
            variant="outlined"
            value={formInputs.name}
            onChange={handleFormInputChange}
            sx={{ mt: 1, mb: 2 }}
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
          <FormControl fullWidth variant="outlined">
            <InputLabel id="type-label">Type</InputLabel>
            <Select
              labelId="type-label"
              id="type"
              name="type"
              value={formInputs.type}
              onChange={handleFormInputChange as (event: SelectChangeEvent) => void}
              label="Type"
            >
              {ruleSetTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={closeDialogs} color="inherit" startIcon={<CancelIcon />}>
            Cancel
          </Button>
          <Button 
            onClick={currentRuleSet ? handleUpdateRuleSet : handleCreateRuleSet} 
            color="primary"
            variant="contained"
            startIcon={<SaveIcon />}
          >
            {currentRuleSet ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Rule Set Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={closeDialogs}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Delete Rule Set
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the rule set "{currentRuleSet?.name}"? 
            This will also delete all rules associated with this rule set. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={closeDialogs} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteRuleSet} 
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Create/Edit Rule Dialog */}
      <Dialog
        open={openRuleDialog}
        onClose={closeDialogs}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {currentRule ? 'Edit Rule' : 'Create Rule'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            name="title"
            label="Rule Title"
            type="text"
            fullWidth
            variant="outlined"
            value={ruleFormInputs.title}
            onChange={handleRuleFormInputChange}
            sx={{ mt: 1, mb: 2 }}
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
            value={ruleFormInputs.description}
            onChange={handleRuleFormInputChange}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth variant="outlined">
            <InputLabel id="severity-label">Severity</InputLabel>
            <Select
              labelId="severity-label"
              id="severity"
              name="severity"
              value={ruleFormInputs.severity}
              onChange={handleRuleFormInputChange as (event: SelectChangeEvent) => void}
              label="Severity"
            >
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="low">Low</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={closeDialogs} color="inherit" startIcon={<CancelIcon />}>
            Cancel
          </Button>
          <Button 
            onClick={currentRule ? handleUpdateRule : handleCreateRule} 
            color="primary"
            variant="contained"
            startIcon={<SaveIcon />}
          >
            {currentRule ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Rule Dialog */}
      <Dialog
        open={openRuleDeleteDialog}
        onClose={closeDialogs}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Delete Rule
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the rule "{currentRule?.title}"? 
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={closeDialogs} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteRule} 
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={closeSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Rules;
