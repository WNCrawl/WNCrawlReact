export default{

  // ============ 全局url ===============
  getNavTree: '/api/user/fetch_user_permissions',
  l: '',


  // ============ 数据同步url ===============
  
  saveNewTask: '/api/sync/create_task',//保存任务
  allTaskList: ' /api/sync/list_task',//查询所有同步任务
  updateTaskSync: '/api/sync/&/update_task',//更新任务
  delTask: '/api/sync/remove_task/',//删除任务
  getTaskInfo: '/api/sync/get_task/',//根据id获取任务详情
  allCycleIns: '/api/sync/list_instance',//获取所有周期实例
  delCycleIns: '/api/sync/remove_instance',//删除周期实例
  reRunCycleIns: '/api/sync/rerun_instance',//重跑周期实例
  allSuppData: '/api/sync/list_data_instance',//补数据实例列表
  suppDataDetail: '/api/sync/detail_data_instance/',//补数据详情
  delSuppData: '/api/sync/remove_data',//删除补数据任务
  reRunSuppData: '/api/sync/rerun_data',//重跑补数据任务
  suppSyncData: '/api/sync/create_data',
  killAllInstance: '/api/sync/&/kill_all_data',
  startTask: '/api/sync/start',//启动任务
  deployFromtask: '/api/sync/deploy',//发布任务
  showTaskLog: '/api/sync/log',//查看任务日志
  
  // ============ 爬虫管理url ===============
  
  //ip管理api
  createProxyIp: '/api/crawl/ip/create_proxy_ip',
  getProxyIp: '/api/crawl/ip/&/get_proxy_ip',
  updateProxyIp: '/api/crawl/ip/&/update_proxy_ip',
  delProxyIp: '/api/crawl/ip/&/remove_proxy_ip',
  getAllProxyIp: '/api/crawl/ip/list_proxy_ip',

  //工程api
  getPlatformList: '/api/meta/platform/list_platform',
  getProjectTree: '/api/project/&/tree',
  creaCrawProject: '/api/project/create',
  createFile: '/api/project/file/create',
  renameFile: '/api/project/file/rename',
  updateFileContent: '/api/project/file/update',
  delFile: '/api/project/file/delete',
  getFileContent: '/api/project/file/read',
  delProject: '/api/project/&/remove',
  getAccountList: '/api/meta/account/list_account',
  getHostList: '/api/node/index_node',
  saveScriptConfig: '/api/script/edit_script_cfg',
  buildProject: '/api/project/&/build',
  addNewFile: '/api/project/file/create',
  deployProject: '/api/project/&/task_deploy',
  getNodeList: '/api/node/node_manager',
  createNode: '/api/node/create_node',
  updateNode: '/api/node/&/update',
  delNode: '/api/node/&/remove',
  queryNode: '/api/node/&$',

  //开始测试
  getScriptResult: '/api/script/find_debug_result',
  getScriptLogLine: '/api/script/find_debug_log',
  runScript: '/api/script/debug_script',

  //查看脚本
  getCrawScriptList: '/api/script/list_scripts',
  getTaskByScriptId: '/api/script/&/task',
  startScripts: '/api/script/start',
  stopScripts: '/api/script/stop',
  disableScripts: '/api/script/disable',
  enableScripts: '/api/script/enable',
  getScriptDetail: '/api/script/get_host',
  showCrawTaskLog: '/api/script/log',//查看爬虫任务日志




  //任务管理
  getAllTask: '/api/task/task_index',
  createNewTask: '/api/task/create_task',
  removeTask: '/api/task/&/remove',
  getTaskDetail: '/api/task/&/info',
  updateTask: '/api/task/&/update',
  getPlatformList: '/api/meta/platform/list_platform',


  //爬虫进度
  getCrawSche: '/api/script/list_task_progress',

  //节点管理
  getNodePartTwo: '/api/node/node_spider_info',
  getAllNode: '/api/node/node_manager',

  removeScriptDetailItem: '/api/script/remove',


  
  
  // ============ 数据源管理url ===============
  createSource: '/api/ds/create_source',
  updateSource: '/api/ds/&/edit_source',
  delSource: '/api/ds/&/remove_source',
  getSourceDetail: '/api/ds/&/get_source',
  getAllSources: '/api/ds/list_sources',
  testConnection: '/api/ds/test_source',
  getScriptFileList: '/api/ds/get_parse_script_list',

  // ============ 用户中心url ===============
  createNewUser: '/api/user/create_user',
  updateUserInfo: '/api/user/&/edit_user',
  resetUserPassword: '/api/user/&/reset_pwd',
  delUser: '/api/user/&/remove_user',
  queryUsers: '/api/user/query_users',
  createRole: '/api/user/create_role',
  getPermissions: '/api/user/query_permissions',
  updateRoleInfo: '/api/user/&/edit_role',
  getRoleList: '/api/user/list_role',
  getRoleDetail: '/api/user/&/query_role',
  getMemberDetail: '/api/user/&/get_user',

  // ============ 用户中心url ===============
  login: '/api/user/login',
  getUser: '/api/user/&/get_profile',
  updateInfo: '/api/user/&/edit_profile',
  updatePass: '/api/user/&/reset_profile_pwd',

  // ============ 告警 ===============
  getAlertTypeList: '/api/alert/list_alert_type',
  getAlertList: '/api/alert/list_alert_log',
  getUserList: '/api/alert/list_alert_user',

  // ============ 数据维护 ===============
  //部门资料
  getDepartmentList: '/api/meta/dept/list_dept',
  addDepartment: '/api/meta/dept/create_dept',
  delDepartment: '/api/meta/dept/delete_dept/&',
  updateDepart: '/api/meta/dept/&/edit_dept',
  getDepartDetail: '/api/meta/dept/&/query_dept',
  getDepartTree: '/api/meta/dept/tree',

  //shop
  getShopList_all: '/api/meta/shop/list_shop',
  delShop_all: '/api/meta/shop/delete_shop/&',
  getAllShopDetail: '/api/meta/shop/&/query_shop',
  updateShop_all:'/api/meta/shop/&/edit_shop',



  getShopList_plat: '/api/meta/platform_shop/list_platform_shop',
  delShop_plat: '/api/meta/platform_shop/&/delete_platform_shop',
  getShopDetail_plat: '/api/meta/platform_shop/&/query_platform_shop',
  updateShop_plat: '/api/meta/shop/create_shop',

  getShopList_erp: '/api/meta/erp_shop/list_erp_shop',
  delShop_erp: '/api/meta/erp_shop/&/delete_erp_shop',
  getShopDetail_erp: '/api/meta/erp_shop/&/query_erp_shop',
  updateShop_erp: '/api/meta/shop/create_shop',

  getPlatCodeList: '/api/meta/dict/list_dict/&',

  getBrandList: '/api/meta/brand/list_brand',
  
  validateCoeData: '/api/meta/shop/verify_quota_params',

  //店铺年级页面原始渠道店铺id列表和原始erp电偶列表
  getOldChannelShopList: '/api/meta/shop/search_shop',
  getOldERPShopList: '/api/meta/erp_shop/search_erp_shop',


  //good type
  getGoodtypeList: '/api/meta/good_cate/list_good_cate',
  updateGoodType: '/api/meta/good_cate/&/edit_good_cate',
  saveNewGoodType: '/api/meta/good_cate/create_good_cate',
  delGoodType: '/api/meta/good_cate/delete_good_cate/&',
  getGoodTypeDetail:'/api/meta/good_cate/&/query_good_cate',
  getTypeMenuTree: '/api/meta/good_cate/tree',

  //good exc
  getGoodExcList: '/api/meta/goods_error_info/list_goods_error_info',
  geuGoodExcDetail: '/api/meta/goods_error_info/&/query_goods_error_info',
  ingnoreGoodExc: '/api/meta/goods_error_info/&/ignore_goods_error_info',
  passGoodExc: '/api/meta/goods_error_info/&/edit_goods_error_info',
  getCateitems: '/api/meta/word/&/get_list_by_cate',

  //good info
  getGoodInfoList: '/api/meta/goods_info/list_goods_info',
  getGoodInfoDetail: '/api/meta/goods_info/&/query_goods_info',
  updateGoodInfo: '/api/meta/goods_info/&/edit_goods_info',


  //meter
  getMeterDetail: '/api/meta/material/&/query_material',
  delMeter: '/api/meta/material/delete_material/&',
  addNewMeter: '/api/meta/material/create_material',
  updateMeter: '/api/meta/material/&/edit_material',
  getMeterList: '/api/meta/material/list_material',

  //word
  getWordDetail: '/api/meta/word/&/query_word',
  delWord: '/api/meta/word/delete_word/&',
  addNewWord: '/api/meta/word/create_word',
  updateWord: '/api/meta/word/&/edit_word',
  getWordList: '/api/meta/word/list_word',

  //newword
  getNewWordList: '/api/meta/check_new_word/list_word',
  editNewWordStatus:'/api/meta/check_new_word/&/check_word',
  getNewWordDetail: '/api/meta/check_new_word/&/query_word',


  //blackList
  delBlackListItem: '/api/meta/black_word/delete_black_word/&',
  getBlackList: '/api/meta/black_word/list_black_word',
  addNewBlackListItem: '/api/meta/black_word/create_black_word',

  //dataplat
  getPlatDetail: '/api/meta/platform/&/query_platform',
  delPlat: '/api/meta/platform/delete_platform/&',
  addNewDataPlat: '/api/meta/platform/create_platform',
  updateDataPlat: '/api/meta/platform/&/edit_platform',
  getDataPlatList: '/api/meta/platform/list_platform',

  //account
  addNewAccount: '/api/meta/account/create_account',
  updateAccount: '/api/meta/account/&/edit_account',
  getAccountDetail: '/api/meta/account/&/query_account',
  delAccount: '/api/meta/account/delete_account/&',
  getChannel: '/api/meta/channel/list_channel',
  // getAccountList_b: '',
  

  // craw data
  getCrawDataList: '/api/meta/relation/list_relation',
  delshop_cd: '/api/meta/relation/&/delete_detail',
  delDataPlat_cd: '/api/meta/relation/&/delete_relation',
  preview_cd: '/api/meta/relation/preview_data',
  updateCrawData_cd: '/api/meta/relation/edit_relation',
  addNewCrawData_cd: '/api/meta/relation/create_relation',
  getDataPlatList_cd: '/api/meta',
  getShopList_cd: '/api/meta/shop/list_shop',
  getCrawDetail_cd: '/api/meta/relation/&/query_relation',

  //parse rules
  getRulesList: '/api/',
  updateRule: '/api/',
  delRule: '/api/',

}