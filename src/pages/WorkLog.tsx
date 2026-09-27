import { Clock, Users } from 'lucide-react';
import { WORK_LOG } from '../data/workLog';

export default function WorkLog() {
  const totalHours = WORK_LOG.reduce((sum, entry) => sum + entry.hours, 0);

  return (
    <section className="px-6 sm:px-8 md:px-12 pt-28 md:pt-36 pb-24 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <p className="text-sky-400 text-xs tracking-widest uppercase mb-3">TSA Required Documentation</p>
        <h1 className="text-white text-3xl sm:text-4xl font-light leading-tight tracking-tight">
          Student Work Log
        </h1>
        <p className="text-white/50 text-sm mt-4 max-w-xl font-light">
          Chronological log of project milestones, tasks, and team member contributions during the 2026–27 school year.
        </p>

        <div className="mt-8 flex gap-6 text-sm text-white/60 mb-8">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-400" />
            <span>{totalHours} Total Hours</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-sky-400" />
            <span>2 Team Members</span>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/[0.02]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-white/40 text-xs uppercase tracking-wider bg-white/[0.02]">
                <th className="py-4 px-6 font-medium">Date</th>
                <th className="py-4 px-6 font-medium">Member</th>
                <th className="py-4 px-6 font-medium">Hours</th>
                <th className="py-4 px-6 font-medium">Task</th>
                <th className="py-4 px-6 font-medium">Deliverable</th>
              </tr>
            </thead>
            <tbody className="text-sm text-white/80">
              {WORK_LOG.map((entry, idx) => (
                <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors last:border-0">
                  <td className="py-4 px-6 whitespace-nowrap text-white/50">{entry.date}</td>
                  <td className="py-4 px-6 whitespace-nowrap">{entry.member}</td>
                  <td className="py-4 px-6 whitespace-nowrap tabular-nums">{entry.hours}</td>
                  <td className="py-4 px-6">{entry.task}</td>
                  <td className="py-4 px-6 text-white/60">{entry.deliverable}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
