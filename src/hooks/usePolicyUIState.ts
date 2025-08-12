import { useState, ChangeEvent, SyntheticEvent } from 'react';
import { Policy, PolicySet } from './usePolicySets';

interface FormInputs {
  name: string;
  description: string;
  type: string;
}

interface PolicyFormInputs {
  name: string;
  description: string;
  status: 'active' | 'draft' | 'inactive';
}

interface MenuAnchors {
  [key: string]: HTMLElement | null;
}

export interface UsePolicyUIStateReturn {
  // Selected policy set
  selectedPolicySetId: string | null;
  setSelectedPolicySetId: (id: string | null) => void;
  viewPolicySet: (policySetId: string) => void;
  backToPolicySets: () => void;
  
  // Dialog state
  openCreateDialog: boolean;
  openEditDialog: boolean;
  openDeleteDialog: boolean;
  openPolicyDialog: boolean;
  openPolicyDeleteDialog: boolean;
  
  // Dialog actions
  openCreatePolicySetDialog: () => void;
  openEditPolicySetDialog: (policySet: PolicySet) => void;
  openDeletePolicySetDialog: (policySet: PolicySet) => void;
  openCreatePolicyDialog: (policySetId: string) => void;
  openEditPolicyDialog: (policySetId: string, policy: Policy) => void;
  openDeletePolicyDialog: (policySetId: string, policy: Policy) => void;
  closeDialogs: () => void;
  
  // Current items
  currentPolicySet: PolicySet | null;
  currentPolicy: Policy | null;
  
  // Form state
  formInputs: FormInputs;
  policyFormInputs: PolicyFormInputs;
  handleFormInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handlePolicyFormInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  resetFormInputs: () => void;
  resetPolicyFormInputs: () => void;
  
  // Tab state
  selectedTab: number;
  setSelectedTab: (tab: number) => void;
  
  // Menu state
  menuAnchors: MenuAnchors;
  handleMenuOpen: (event: SyntheticEvent, policySetId: string) => void;
  handleCloseMenu: (policySetId: string) => void;
}

export const usePolicyUIState = (): UsePolicyUIStateReturn => {
  // State for the selected policy set (when viewing policies for a specific set)
  const [selectedPolicySetId, setSelectedPolicySetId] = useState<string | null>(null);
  
  // State for controlling dialog visibility
  const [openCreateDialog, setOpenCreateDialog] = useState<boolean>(false);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [openPolicyDialog, setOpenPolicyDialog] = useState<boolean>(false);
  const [openPolicyDeleteDialog, setOpenPolicyDeleteDialog] = useState<boolean>(false);

  // State for tracking which item is being edited/deleted
  const [currentPolicySet, setCurrentPolicySet] = useState<PolicySet | null>(null);
  const [currentPolicy, setCurrentPolicy] = useState<Policy | null>(null);

  // Form input state for policy sets
  const [formInputs, setFormInputs] = useState<FormInputs>({
    name: '',
    description: '',
    type: 'authorization'
  });

  // Form input state for policies
  const [policyFormInputs, setPolicyFormInputs] = useState<PolicyFormInputs>({
    name: '',
    description: '',
    status: 'active'
  });

  // State for tab selection (for filtering policy sets by type)
  const [selectedTab, setSelectedTab] = useState<number>(0);
  
  // State for policy set menu anchors (for dropdown menus)
  const [menuAnchors, setMenuAnchors] = useState<MenuAnchors>({});

  // Reset form inputs
  const resetFormInputs = (): void => {
    setFormInputs({
      name: '',
      description: '',
      type: 'authorization'
    });
  };

  // Reset policy form inputs
  const resetPolicyFormInputs = (): void => {
    setPolicyFormInputs({
      name: '',
      description: '',
      status: 'active'
    });
  };

  // Open create policy set dialog
  const openCreatePolicySetDialog = (): void => {
    resetFormInputs();
    setOpenCreateDialog(true);
  };

  // Open edit policy set dialog
  const openEditPolicySetDialog = (policySet: PolicySet): void => {
    setCurrentPolicySet(policySet);
    setFormInputs({
      name: policySet.name,
      description: policySet.description,
      type: policySet.type
    });
    setOpenEditDialog(true);
    handleCloseMenu(policySet.id);
  };

  // Open delete policy set dialog
  const openDeletePolicySetDialog = (policySet: PolicySet): void => {
    setCurrentPolicySet(policySet);
    setOpenDeleteDialog(true);
    handleCloseMenu(policySet.id);
  };

  // Close all dialogs
  const closeDialogs = (): void => {
    setOpenCreateDialog(false);
    setOpenEditDialog(false);
    setOpenDeleteDialog(false);
    setOpenPolicyDialog(false);
    setOpenPolicyDeleteDialog(false);
  };

  // Handle policy set menu open
  const handleMenuOpen = (event: SyntheticEvent, policySetId: string): void => {
    event.stopPropagation();
    setMenuAnchors({
      ...menuAnchors,
      [policySetId]: event.currentTarget as HTMLElement
    });
  };

  // Handle policy set menu close
  const handleCloseMenu = (policySetId: string): void => {
    setMenuAnchors({
      ...menuAnchors,
      [policySetId]: null
    });
  };

  // Open policy dialog
  const openCreatePolicyDialog = (policySetId: string): void => {
    setSelectedPolicySetId(policySetId);
    resetPolicyFormInputs();
    setOpenPolicyDialog(true);
  };

  // Open edit policy dialog
  const openEditPolicyDialog = (policySetId: string, policy: Policy): void => {
    setSelectedPolicySetId(policySetId);
    setCurrentPolicy(policy);
    setPolicyFormInputs({
      name: policy.name,
      description: policy.description,
      status: policy.status
    });
    setOpenPolicyDialog(true);
  };

  // Open delete policy dialog
  const openDeletePolicyDialog = (policySetId: string, policy: Policy): void => {
    setSelectedPolicySetId(policySetId);
    setCurrentPolicy(policy);
    setOpenPolicyDeleteDialog(true);
  };

  // Navigate to policy set details
  const viewPolicySet = (policySetId: string): void => {
    setSelectedPolicySetId(policySetId);
  };

  // Back to policy sets list
  const backToPolicySets = (): void => {
    setSelectedPolicySetId(null);
  };

  // Handle form input changes
  const handleFormInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormInputs({
      ...formInputs,
      [name]: value
    });
  };

  // Handle policy form input changes
  const handlePolicyFormInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setPolicyFormInputs({
      ...policyFormInputs,
      [name]: value
    });
  };

  return {
    // Selected policy set
    selectedPolicySetId,
    setSelectedPolicySetId,
    viewPolicySet,
    backToPolicySets,
    
    // Dialog state
    openCreateDialog,
    openEditDialog,
    openDeleteDialog,
    openPolicyDialog,
    openPolicyDeleteDialog: openPolicyDeleteDialog,
    
    // Dialog actions
    openCreatePolicySetDialog,
    openEditPolicySetDialog,
    openDeletePolicySetDialog,
    openCreatePolicyDialog,
    openEditPolicyDialog,
    openDeletePolicyDialog,
    closeDialogs,
    
    // Current items
    currentPolicySet,
    currentPolicy,
    
    // Form state
    formInputs,
    policyFormInputs,
    handleFormInputChange,
    handlePolicyFormInputChange,
    resetFormInputs,
    resetPolicyFormInputs,
    
    // Tab state
    selectedTab,
    setSelectedTab,
    
    // Menu state
    menuAnchors,
    handleMenuOpen,
    handleCloseMenu
  };
};
