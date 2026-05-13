import { useAppStore } from './store/appStore';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import TodaysPlan from './pages/TodaysPlan';
import Planner from './pages/Planner';
import Meetings from './pages/Meetings';
import EmailIntelligence from './pages/EmailIntelligence';
import Calendar from './pages/Calendar';
import DailyBriefing from './pages/DailyBriefing';
import AutomationEngine from './pages/AutomationEngine';
import Notifications from './pages/Notifications';

export default function App() {
  const { state, setActiveSection, markNotificationRead, markAllNotificationsRead, updateTaskStatus } = useAppStore();

  const renderContent = () => {
    switch (state.activeSection) {
      case 'dashboard': return <TodaysPlan state={state} />;
      case 'planner': return <Planner state={state} updateTaskStatus={updateTaskStatus} />;
      case 'meetings': return <Meetings state={state} />;
      case 'email': return <EmailIntelligence state={state} />;
      case 'calendar': return <Calendar state={state} />;
      case 'briefing': return <DailyBriefing state={state} />;
      case 'automation': return <AutomationEngine state={state} />;
      case 'notifications': return (
        <Notifications
          state={state}
          markNotificationRead={markNotificationRead}
          markAllNotificationsRead={markAllNotificationsRead}
          setActiveSection={setActiveSection}
        />
      );
      default: return <TodaysPlan state={state} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-canvas">
      <Sidebar state={state} setActiveSection={setActiveSection} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header state={state} />
        <main className="flex-1 overflow-hidden flex">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
