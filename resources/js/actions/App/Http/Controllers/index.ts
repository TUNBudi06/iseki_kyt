import MainController from './MainController'
import AdminController from './AdminController'
import LeaderController from './LeaderController'
const Controllers = {
    MainController: Object.assign(MainController, MainController),
AdminController: Object.assign(AdminController, AdminController),
LeaderController: Object.assign(LeaderController, LeaderController),
}

export default Controllers