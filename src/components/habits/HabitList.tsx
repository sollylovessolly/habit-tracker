import { Habit } from '@/types/habit'
import HabitCard from '@/components/habits/HabitCard'

type Props = {
  habits: Habit[]
  onUpdate: (habit: Habit) => void
  onEdit: (habit: Habit) => void
  onDelete: (id: string) => void
}

export default function HabitList({ habits, onUpdate, onEdit, onDelete }: Props) {
  return (
    <div>
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          onUpdate={onUpdate}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}