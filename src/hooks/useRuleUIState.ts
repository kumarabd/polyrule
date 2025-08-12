import { useState, useCallback, ChangeEvent, MouseEvent } from 'react';
import { RuleSet, Rule } from './useRuleSets';

// Interface for form inputs
export interface RuleSetFormInputs {
  name: string;
  description: string;
  type: string;
}

export interface RuleFormInputs {
  title: string;
  description: string;
  severity: string;
}

// Interface for menu anchors
export interface MenuAnchors {
  [key: string]: HTMLElement | null;
}

export const useRuleUIState = () => {
  // Navigation state - tracks which rule set is currently being viewed
  const [selectedRuleSetId, setSelectedRuleSetId] = useState<string | null>(null);
  
  // Tab state for filtering rule sets by type
  const [selectedTab, setSelectedTab] = useState<number>(0);
  
  // Dialog states for rule sets
  const [openCreateDialog, setOpenCreateDialog] = useState<boolean>(false);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  
  // Dialog states for rules within a rule set
  const [openRuleDialog, setOpenRuleDialog] = useState<boolean>(false);
  const [openRuleDeleteDialog, setOpenRuleDeleteDialog] = useState<boolean>(false);
  
  // Current selections
  const [currentRuleSet, setCurrentRuleSet] = useState<RuleSet | null>(null);
  const [currentRule, setCurrentRule] = useState<Rule | null>(null);
  
  // Form inputs for rule sets
  const [formInputs, setFormInputs] = useState<RuleSetFormInputs>({
    name: '',
    description: '',
    type: 'security'
  });
  
  // Form inputs for rules
  const [ruleFormInputs, setRuleFormInputs] = useState<RuleFormInputs>({
    title: '',
    description: '',
    severity: 'medium'
  });
  
  // Menu anchors for rule sets and rules
  const [menuAnchors, setMenuAnchors] = useState<MenuAnchors>({});
  
  // Navigation handlers
  const viewRuleSet = useCallback((id: string): void => {
    setSelectedRuleSetId(id);
  }, []);
  
  const backToRuleSets = useCallback((): void => {
    setSelectedRuleSetId(null);
  }, []);
  
  // Form input handlers
  const handleFormInputChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormInputs(prev => ({ ...prev, [name]: value }));
  }, []);
  
  const handleRuleFormInputChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setRuleFormInputs(prev => ({ ...prev, [name]: value }));
  }, []);
  
  // Dialog handlers for rule sets
  const openCreateRuleSetDialog = useCallback((): void => {
    setFormInputs({
      name: '',
      description: '',
      type: 'security'
    });
    setOpenCreateDialog(true);
  }, []);
  
  const openEditRuleSetDialog = useCallback((ruleSet: RuleSet): void => {
    setCurrentRuleSet(ruleSet);
    setFormInputs({
      name: ruleSet.name,
      description: ruleSet.description,
      type: ruleSet.type
    });
    setOpenEditDialog(true);
  }, []);
  
  const openDeleteRuleSetDialog = useCallback((ruleSet: RuleSet): void => {
    setCurrentRuleSet(ruleSet);
    setOpenDeleteDialog(true);
  }, []);
  
  // Dialog handlers for rules
  const openCreateRuleDialog = useCallback((ruleSetId: string): void => {
    setRuleFormInputs({
      title: '',
      description: '',
      severity: 'medium'
    });
    setOpenRuleDialog(true);
  }, []);
  
  const openEditRuleDialog = useCallback((rule: Rule): void => {
    setCurrentRule(rule);
    setRuleFormInputs({
      title: rule.title,
      description: rule.description,
      severity: rule.severity || 'medium'
    });
    setOpenRuleDialog(true);
  }, []);
  
  const openDeleteRuleDialog = useCallback((rule: Rule): void => {
    setCurrentRule(rule);
    setOpenRuleDeleteDialog(true);
  }, []);
  
  // Close all dialogs
  const closeDialogs = useCallback((): void => {
    setOpenCreateDialog(false);
    setOpenEditDialog(false);
    setOpenDeleteDialog(false);
    setOpenRuleDialog(false);
    setOpenRuleDeleteDialog(false);
    setCurrentRuleSet(null);
    setCurrentRule(null);
  }, []);
  
  // Menu handlers
  const handleMenuOpen = useCallback((id: string, event: MouseEvent<HTMLElement>): void => {
    setMenuAnchors(prev => ({
      ...prev,
      [id]: event.currentTarget
    }));
  }, []);
  
  const handleCloseMenu = useCallback((id: string): void => {
    setMenuAnchors(prev => ({
      ...prev,
      [id]: null
    }));
  }, []);
  
  return {
    // Navigation state
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
  };
};

export default useRuleUIState;
