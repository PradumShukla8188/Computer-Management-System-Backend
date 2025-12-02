export const PERMISSION_KEYS = {
  DASHBOARD: 'list-dashboard',

  // ---------ASSETS----------//

  ADD_ASSETS: 'add-assets',
  LIST_ASSETS: 'assets',
  DELETE_ASSETS: 'delete-assets',
  // VIEW_ASSETS: 'view-assets',
  UPDATE_ASSETS: 'update-assets',


  // ----------CLASSESS----------//

  ADD_CLASSES: 'add-classes',
  LIST_CLASSES: 'list-classes',
  DELETE_CLASSES: 'delete-classes',
  // VIEW_CLASSES: 'view-classes',
  UPDATE_CLASSES: 'update-classes',


  // ---------USERS----------//

  ADD_USERS: 'add-users',
  LIST_USERS: 'list-users',
  // DELETE_USERS: 'delete-users',
  // VIEW_USERS: 'view-users',
  UPDATE_USERS: 'update-users',


  // ----------Roles----------//

  ADD_ROLES: 'add-roles',
  LIST_ROLES: 'list-roles',
  // DELETE_ROLES: 'delete-roles',
  // VIEW_ROLES: 'view-roles',
  UPDATE_ROLES: 'update-roles',


  // ---------TAGS---------//

  ADD_TAGS: 'add-tags',
  LIST_TAGS: 'list-tags',
  DELETE_TAGS: 'delete-tags',
  // VIEW_TAGS: 'view-tags',
  UPDATE_TAGS: 'update-tags',


  // ---------ICONS----------//

  ADD_ICON: 'add-icons',
  LIST_ICON: 'list-icons',
  DELETE_ICON: 'delete-icons',
  // VIEW_ICON: 'view-icons',
  UPDATE_ICON: 'update-icons',


  // ------Digital Library------//

  ADD_LB_FILE: 'add-lib-file',
  DELETE_LB_FILE: 'delete-lib-file',
  LIST_LB_FILE: 'lib-file',
  // VIEW_LB_FILE: 'view-lib-file',
  UPDATE_LIB_FILE: 'update-lib-file',


  //--------Inspection Category-------//

  // ADD_QUESTIONS: 'add-questions',
  // UPDATE_QUESTIONS: 'update-questions',
  // LIST_QUESTIONS: 'list-questions',
  CREATE_INSPECTION: 'create-inspection',
  LIST_INSPECTION: 'inspection',
  VIEW_INSPECTION: 'view-inspection',


  //---------- Maintenance Category ----------//

  CREATE_MAINTENANCE: 'create-maintenance',
  LIST_MAINTENANCE: 'maintenance',
  VIEW_MAINTENANCE: 'view-maintenance',
  UPDATE_MAINTENANCE: 'update-maintenance',


  //------------- JOBS ------------//

  // ADD_JOB_CATEGORY: 'add-job-category',
  // LIST_JOB_CATEGORY: 'list-job-category',
  // DELETE_JOB_CATEGORY: "delete-job-category",
  // UPDATE_JOB_CATEGORY: "update-job-category",
  CREATE_JOB: 'create-job',
  LIST_JOB: 'job',
  VIEW_JOB: 'view-job',
  UPDATE_JOB: 'update-job',

  //Reports
  EQUIPMENT_REPORT: 'equipment-report',

  //Group
  GROUP_LIST: 'list-group',
  GROUP_CREATE: 'group-create',
  GROUP_EDIT: 'group-edit',
  GROUP_DELETE: 'group-delete',
};

export const permissionsList: {
  name: string;
  displayName: string;
  group: string;
  order: number;
}[] = [
    ///////////////////////-----Dashboard--------//////////////////////////////
    {
      name: PERMISSION_KEYS.DASHBOARD,
      displayName: 'Dashboard',
      group: 'Dashboard',
      order: 1,
    },

    //////////////////////-----Tags----------/////////////////////////////////
    {
      name: PERMISSION_KEYS.ADD_TAGS,
      displayName: 'Add Tags',
      group: 'Tags',
      order: 1000,
    },
    {
      name: PERMISSION_KEYS.LIST_TAGS,
      displayName: 'List Tags',
      group: 'Tags',
      order: 2,
    },
    {
      name: PERMISSION_KEYS.DELETE_TAGS,
      displayName: 'Delete Tags',
      group: 'Tags',
      order: 1000,
    },
    // {
    //   name: PERMISSION_KEYS.VIEW_TAGS,
    //   displayName: 'View Tags',
    //   group: 'Tags',
    //   order: 1000,
    // },
    {
      name: PERMISSION_KEYS.UPDATE_TAGS,
      displayName: 'Update Tags',
      group: 'Tags',
      order: 1000,
    },

    //////////////////////--------ROLES----------/////////////////////////////
    {
      name: PERMISSION_KEYS.ADD_ROLES,
      displayName: 'Add Roles',
      group: 'Roles',
      order: 1000,
    },
    {
      name: PERMISSION_KEYS.LIST_ROLES,
      displayName: 'List Roles',
      group: 'Roles',
      order: 3,
    },
    // {
    //   name: PERMISSION_KEYS.DELETE_ROLES,
    //   displayName: 'Delete Roles',
    //   group: 'Roles',
    //   order: 1000,
    // },
    // {
    //   name: PERMISSION_KEYS.VIEW_ROLES,
    //   displayName: 'View Roles',
    //   group: 'Roles',
    //   order: 1000,
    // },
    {
      name: PERMISSION_KEYS.UPDATE_ROLES,
      displayName: 'Update Roles',
      group: 'Roles',
      order: 1000,
    },

    ////////////////////////-------Icon SET----------//////////////////////////////
    {
      name: PERMISSION_KEYS.ADD_ICON,
      displayName: 'Add Icons',
      group: 'Icons',
      order: 1000,
    },
    {
      name: PERMISSION_KEYS.LIST_ICON,
      displayName: 'List Icons',
      group: 'Icons',
      order: 4,
    },
    {
      name: PERMISSION_KEYS.DELETE_ICON,
      displayName: 'Delete Icons',
      group: 'Icons',
      order: 1000,
    },
    // {
    //   name: PERMISSION_KEYS.VIEW_ICON,
    //   displayName: 'View Icons',
    //   group: 'Icons',
    //   order: 1000,
    // },
    {
      name: PERMISSION_KEYS.UPDATE_ICON,
      displayName: 'Update Icons',
      group: 'Icons',
      order: 1000,
    },

    ////////////////////////////------Classes-------////////////////////////////////
    {
      name: PERMISSION_KEYS.ADD_CLASSES,
      displayName: 'Add Classes',
      group: 'Classes',
      order: 1000,
    },
    {
      name: PERMISSION_KEYS.LIST_CLASSES,
      displayName: 'List Classes',
      group: 'Classes',
      order: 5,
    },
    {
      name: PERMISSION_KEYS.DELETE_CLASSES,
      displayName: 'Delete Classes',
      group: 'Classes',
      order: 1000,
    },
    // {
    //   name: PERMISSION_KEYS.VIEW_CLASSES,
    //   displayName: 'View Classes',
    //   group: 'Classes',
    //   order: 1000,
    // },
    {
      name: PERMISSION_KEYS.UPDATE_CLASSES,
      displayName: 'Update Classes',
      group: 'Classes',
      order: 1000,
    },


    ///////////////------Users-------///////////////////////////////////////////

    {
      name: PERMISSION_KEYS.ADD_USERS,
      displayName: 'Add Users',
      group: 'Users',
      order: 1000,
    },
    {
      name: PERMISSION_KEYS.LIST_USERS,
      displayName: 'List Users',
      group: 'Users',
      order: 6,
    },
    // {
    //   name: PERMISSION_KEYS.DELETE_USERS,
    //   displayName: 'Delete Users',
    //   group: 'Users',
    //   order: 1000,
    // },
    // {
    //   name: PERMISSION_KEYS.VIEW_USERS,
    //   displayName: 'View Users',
    //   group: 'Users',
    //   order: 1000,
    // },
    {
      name: PERMISSION_KEYS.UPDATE_USERS,
      displayName: 'Update Users',
      group: 'Users',
      order: 1000,
    },


    ///////////////////////////------Assets-------////////////////////////////
    {
      name: PERMISSION_KEYS.ADD_ASSETS,
      displayName: 'Add Assets',
      group: 'Assets',
      order: 1000,
    },
    {
      name: PERMISSION_KEYS.LIST_ASSETS,
      displayName: 'List Assets',
      group: 'Assets',
      order: 7,
    },
    {
      name: PERMISSION_KEYS.DELETE_ASSETS,
      displayName: 'Delete Assets',
      group: 'Assets',
      order: 1000,
    },
    // {
    //   name: PERMISSION_KEYS.VIEW_ASSETS,
    //   displayName: 'View Assets',
    //   group: 'Assets',
    //   order: 1000,
    // },
    {
      name: PERMISSION_KEYS.UPDATE_ASSETS,
      displayName: 'Update Assets',
      group: 'Assets',
      order: 1000,
    },


    /////////////////////////-----Digital Lib---------/////////////////////////
    {
      name: PERMISSION_KEYS.ADD_LB_FILE,
      displayName: 'Add Library',
      group: 'Library',
      order: 1000,
    },
    {
      name: PERMISSION_KEYS.LIST_LB_FILE,
      displayName: 'List Library',
      group: 'Library',
      order: 8,
    },
    {
      name: PERMISSION_KEYS.DELETE_LB_FILE,
      displayName: 'Delete Library',
      group: 'Library',
      order: 1000,
    },
    // {
    //   name: PERMISSION_KEYS.VIEW_LB_FILE,
    //   displayName: 'View Library',
    //   group: 'Library',
    //   order: 1000,
    // },
    {
      name: PERMISSION_KEYS.UPDATE_LIB_FILE,
      displayName: 'Update Library',
      group: 'Library',
      order: 1000,
    },


    //////////////////------Inspection Category---------//////////////////////
    // {
    //   name: PERMISSION_KEYS.ADD_QUESTIONS,
    //   displayName: 'Add Questions',
    //   group: 'Inspection',
    //   order: 1000,
    // },
    // {
    //   name: PERMISSION_KEYS.UPDATE_QUESTIONS,
    //   displayName: 'Update Questions',
    //   group: 'Inspection',
    //   order: 1000,
    // },
    // {
    //   name: PERMISSION_KEYS.LIST_QUESTIONS,
    //   displayName: 'List Questions',
    //   group: 'Inspection',
    //   order: 1000,
    // },
    {
      name: PERMISSION_KEYS.CREATE_INSPECTION,
      displayName: 'Create Inspection',
      group: 'Inspection',
      order: 1000,
    },
    {
      name: PERMISSION_KEYS.LIST_INSPECTION,
      displayName: 'List Inspections',
      group: 'Inspection',
      order: 9,
    },
    {
      name: PERMISSION_KEYS.VIEW_INSPECTION,
      displayName: 'View Inspection',
      group: 'Inspection',
      order: 1000,
    },


    //////////////////--------- Maintenance ---------//////////////////////
    {
      name: PERMISSION_KEYS.CREATE_MAINTENANCE,
      displayName: 'Create Maintenance ',
      group: 'Maintenance',
      order: 1000,
    },
    {
      name: PERMISSION_KEYS.LIST_MAINTENANCE,
      displayName: 'List Maintenance ',
      group: 'Maintenance',
      order: 10,
    },
    {
      name: PERMISSION_KEYS.VIEW_MAINTENANCE,
      displayName: 'View Maintenance ',
      group: 'Maintenance',
      order: 1000,
    },
    {
      name: PERMISSION_KEYS.UPDATE_MAINTENANCE,
      displayName: 'Update Maintenance',
      group: 'Maintenance',
      order: 1000,
    },


    //////////////////-------------- JOBS -----------------/////////////////////
    {
      name: PERMISSION_KEYS.CREATE_JOB,
      displayName: 'Add Job ',
      group: 'Jobs',
      order: 1000,
    },
    {
      name: PERMISSION_KEYS.LIST_JOB,
      displayName: 'List all Job',
      group: 'Jobs',
      order: 11,
    },
    {
      name: PERMISSION_KEYS.VIEW_JOB,
      displayName: 'View Job',
      group: 'Jobs',
      order: 1000,
    },
    {
      name: PERMISSION_KEYS.UPDATE_JOB,
      displayName: 'Update Job',
      group: 'Jobs',
      order: 1000,
    },

    /////////////////////////  REPORTS //////////////////////
    {
      name: PERMISSION_KEYS.EQUIPMENT_REPORT,
      displayName: 'Equipment Report',
      group: 'Reports',
      order: 12,
    },

    //GROUP
    {
      name: PERMISSION_KEYS.GROUP_LIST,
      displayName: 'List Group',
      group: 'Group',
      order: 12,
    },

    {
      name: PERMISSION_KEYS.GROUP_CREATE,
      displayName: 'Create Group',
      group: 'Group',
      order: 1000,
    },

    {
      name: PERMISSION_KEYS.GROUP_EDIT,
      displayName: 'Edit Group',
      group: 'Group',
      order: 1000,
    },

    {
      name: PERMISSION_KEYS.GROUP_DELETE,
      displayName: 'Delete Group',
      group: 'Group',
      order: 1000,
    },


    //last order 13
  ];
