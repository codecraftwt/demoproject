import { LicenseInfo } from '@mui/x-license-pro'
import { LoadScript } from '@react-google-maps/api'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Auth0ProviderWithHistory from './auth/auth0-provider-with-history'
import { ProtectedRoute } from './auth/protected-route'
import ThemeMode from './components/ThemeMode'
import { CompleteSignUp } from './features/accountSignup/CompleteSignUp'
import { CreateOrganization } from './features/accountSignup/CreateOrganization'
import { SignUp } from './features/accountSignup/SignUp'
import { Login } from './features/auth/Login'
import { Dashboard } from './features/dashboard/Dashboard'
import { EntityForm } from './features/entityForms/EntityForm'
import { Project } from './features/projects/Project'
import { ProjectFormNew } from './features/projects/ProjectFormNew'
import { Projects } from './features/projects/Projects'
import CostCode from './features/projects/cost-codes/CostCode'
import CostCodeDetails from './features/projects/cost-codes/CostCodeDetails'
import { ImportCostCodes } from './features/projects/cost-codes/Import'
import ListCostCodes from './features/projects/cost-codes/ListCostCodes'
import { DailyReportFormExport } from './features/projects/daily-reports/DailyReportFormExport'
import { DailyReportFormNew } from './features/projects/daily-reports/DailyReportFormNew'
import ImportDailyReports from './features/projects/daily-reports/ImportDailyReports'
import { GeoFence } from './features/projects/geofence/GeoFence'
import { TNMDetail } from './features/projects/time-materials/TNMDetail'
import { TimeInMaterialReportExport } from './features/projects/time-materials/TimeInMaterialExport'
import { TimeMaterialForm } from './features/projects/time-materials/TimeMaterialForm'
import { TimeMaterialFormNew } from './features/projects/time-materials/TimeMaterialNew'
import { Timesheet } from './features/projects/timesheets/Timesheet'
import { ProjectsUploader } from './features/projects/uploads/ProjectsUploader'
import EmployeesAttendanceReport from './features/reports/EmployeesAttendanceReport'
import { ReportHome } from './features/reports/ReportHome'
import { TimeCard } from './features/timecard/TimeCard'
import { EditUserNew } from './features/user/EditUserNew'
import { EnrollWorkerNew } from './features/user/EnrollWorkerNew'
import { User } from './features/user/User'
import { Worker } from './features/user/Worker'
import { Workers } from './features/user/Workers'
import { InviteUser } from './features/userManagement/InviteUser'
import { UserManager } from './features/userManagement/UserManager'
import { Verification } from './features/verification/Verification'
import { VerificationAccount } from './features/verification/VerificationAccount'
import { Layout } from './routes/Layout'
import { PublicLayout } from './routes/PublicLayout'
import 'react-toastify/dist/ReactToastify.css'
import { ProjectPhotos } from './features/projects/ProjectPhotos'
import HrViolations from './features/dashboard/HrViolations'
import ContractAI from './features/contract-ai/ContractAI'
import { Files } from './features/files/Files'
import { NewSettings } from './features/settings/NewSettings'
import SetupTimeKiosk from './features/settings/SetupTimeKiosk'
import LinkDeviceKiosk from './features/settings/LinkDeviceKiosk'
import ReadyToUseKiosk from './features/settings/ReadyToUseKiosk'
import AddQuestionForm from './features/Adminquestion/HrAddQuestionForm'
import HrQuestionsTable from './features/Adminquestion/HrQuestionTable'
import DailyReport from './features/reports/DailyReport'
import Profile from './features/dashboard/Profile'

LicenseInfo.setLicenseKey(`${process.env.REACT_APP_X_DATA_GRID_PRO}`)
const googleApiLibraries: ('drawing' | 'geometry' | 'places')[] = ['places']
const googleApiKey: any = process.env.REACT_APP_GOOGLE_MAPS_API_KEY

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
    },
  })

  return (
    <>
      <Auth0ProviderWithHistory>
        <QueryClientProvider client={queryClient}>
          <LoadScript
            googleMapsApiKey={googleApiKey}
            libraries={googleApiLibraries}>
            <ThemeMode>
              <Routes>
                <Route element={<PublicLayout />}>
                  <Route path='/signup' element={<SignUp />} />
                  <Route
                    path='/create-organization'
                    element={<CreateOrganization />}
                  />
                  <Route path='/complete-signup' element={<CompleteSignUp />} />
                  <Route path='/login' element={<Login />} />
                  <Route path='/' element={<Login />} />
                </Route>
                <Route element={<Layout />}>
                  <Route
                    path='/dashboard'
                    element={<ProtectedRoute component={Dashboard} />}
                  />
                  <Route
                    path='/profile'
                    element={<ProtectedRoute component={Profile} />}
                  />
                  <Route
                    path='/dashboard/hr-violations'
                    element={<ProtectedRoute component={HrViolations} />}
                  />
                  <Route
                    path='/workers'
                    element={<ProtectedRoute component={Workers} />}
                  />
                  <Route
                    path='/workers/:id'
                    element={<ProtectedRoute component={Worker} />}
                  />
                  <Route
                    path='/workers/:id/timesheet/:timesheetId'
                    element={<ProtectedRoute component={Timesheet} />}
                  />
                  <Route
                    path='/workers/enrollment'
                    element={<EnrollWorkerNew />}
                  />
                  <Route
                    path='/workers/:id/timecard/edit/:timecardId'
                    element={<ProtectedRoute component={TimeCard} />}
                  />
                  <Route
                    path='/entity-form'
                    element={<ProtectedRoute component={EntityForm} />}
                  />
                  <Route
                    path='/projects'
                    element={<ProtectedRoute component={Projects} />}
                  />
                  <Route
                    path='/projects/:id/daily-reports/new'
                    element={<ProtectedRoute component={DailyReportFormNew} />}
                  />
                  <Route
                    path='/projects/:id/daily-reports/:reportId'
                    element={<DailyReportFormExport />}
                  />
                  <Route
                    path='/projects/:id/daily-reports/upload'
                    element={<ProtectedRoute component={ImportDailyReports} />}
                  />
                  {/* <Route path="/projects/:id/daily-reports/:reportId" element={<ProtectedRoute component={DailyReportFormExport} />} /> */}
                  <Route
                    path='/projects/:id/cost-codes/upload'
                    element={<ProtectedRoute component={ImportCostCodes} />}
                  />
                  <Route
                    path='/projects/:id/cost-codes'
                    element={<ProtectedRoute component={ListCostCodes} />}
                  />
                  <Route
                    path='/projects/:id/cost-codes/:costCodeId'
                    element={<ProtectedRoute component={CostCodeDetails} />}
                  />
                  <Route
                    path='/projects/:id/cost-codes/new'
                    element={<ProtectedRoute component={CostCode} />}
                  />
                  <Route
                    path='/projects/:id/geo-fence'
                    element={<ProtectedRoute component={GeoFence} />}
                  />
                  <Route
                    path='/projects/:id/upload'
                    element={<ProtectedRoute component={ProjectsUploader} />}
                  />
                  {/* <Route
                  path='/projects/:id/timecard/:workerId/out/:timecardId/staff/:authUserSub'
                  element={<ProtectedRoute component={TimeCard} />}
                  /> */}
                  <Route
                    path='/projects/:id/time-material/:tmId/report/new'
                    element={<ProtectedRoute component={TimeMaterialFormNew} />}
                  />
                  <Route
                    path='/projects/:id/time-material/:tmId/report/:tmrId/edit'
                    element={<ProtectedRoute component={TimeMaterialFormNew} />}
                  />
                  <Route
                    path='/projects/:projectId/time-material/:tnmId/report/:id'
                    element={
                      <ProtectedRoute component={TimeInMaterialReportExport} />
                    }
                  />
                  <Route
                    path='/projects/:id/time-material/:tmId'
                    element={<ProtectedRoute component={TNMDetail} />}
                  />
                  <Route
                    path='/projects/:id/time-material/new'
                    element={<ProtectedRoute component={TimeMaterialForm} />}
                  />
                  <Route
                    path='/projects/:id/timecard/edit/:timecardId'
                    element={<ProtectedRoute component={TimeCard} />}
                  />
                  {/* <Route path="/projects/:id/timesheet" element={<ProtectedRoute component={Timesheet} />} /> */}
                  <Route
                    path='/projects/new'
                    element={<ProtectedRoute component={ProjectFormNew} />}
                  />
                  <Route
                    path='/projects/:id'
                    element={<ProtectedRoute component={Project} />}
                  />
                  <Route
                    path='/projects/:id/edit'
                    element={<ProtectedRoute component={ProjectFormNew} />}
                  />
                  <Route
                    path='/projects/:id/photos'
                    element={<ProtectedRoute component={ProjectPhotos} />}
                  />
                  <Route
                    path='/reports'
                    element={<ProtectedRoute component={ReportHome} />}
                  />
                  <Route
                    path='/reports/employee-attendance'
                    element={
                      <ProtectedRoute component={EmployeesAttendanceReport} />
                    }
                  />
                  <Route
                    path='/settings'
                    element={<ProtectedRoute component={NewSettings} />}
                  />
                  <Route
                    path='/setup-time-kiosk'
                    element={<ProtectedRoute component={SetupTimeKiosk} />}
                  />
                  <Route
                    path='/link-device-kiosk'
                    element={<ProtectedRoute component={LinkDeviceKiosk} />}
                  />
                  <Route
                    path='/ready-to-use-kiosk'
                    element={<ProtectedRoute component={ReadyToUseKiosk} />}
                  />
                  <Route
                    path='/user'
                    element={<ProtectedRoute component={User} />}
                  />
                  <Route path='/verification/:id' element={<Verification />} />
                  <Route
                    path='/verification-account/:id'
                    element={<VerificationAccount />}
                  />
                  <Route
                    path='/timecard'
                    element={<ProtectedRoute component={TimeCard} />}
                  />
                  <Route
                    path='/contract-ai'
                    element={<ProtectedRoute component={ContractAI} />}
                  />
                  <Route
                    path='/files'
                    element={<ProtectedRoute component={Files} />}
                  />
                  <Route
                    path='/files/:id'
                    element={<ProtectedRoute component={Files} />}
                  />
                  <Route
                    path='/user-management'
                    element={<ProtectedRoute component={UserManager} />}
                  />
                  <Route
                    path='/user-management/new'
                    element={<ProtectedRoute component={InviteUser} />}
                  />
                  <Route
                    path='/user-management/:id'
                    element={<ProtectedRoute component={User} />}
                  />
                  <Route
                    path='/user-management/:id/edit'
                    element={<ProtectedRoute component={EditUserNew} />}
                  />
                  <Route
                    path='/hr-question'
                    element={<ProtectedRoute component={HrQuestionsTable} />}
                  />
                  <Route
                    path='/hr-add-questions'
                    element={<ProtectedRoute component={AddQuestionForm} />}
                  />
                  <Route
                    path='/reports/daily-report'
                    element={<ProtectedRoute component={DailyReport} />}
                  />
                  {/*// TODO: Need a route/component to display user info /user-management/:id */}
                </Route>
              </Routes>
            </ThemeMode>
          </LoadScript>
        </QueryClientProvider>
      </Auth0ProviderWithHistory>
    </>
  )
}

export default App
