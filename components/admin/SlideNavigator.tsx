'use client'

import { useState } from 'react'
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates,
  useSortable, verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import { type Slide, type SlideType, SLIDE_TYPE_META, createSlide } from '@/lib/presentation/slide-types'

interface Props {
  slides: Slide[]
  selectedIndex: number
  onSelect: (index: number) => void
  onReorder: (slides: Slide[]) => void
  onAdd: (slide: Slide) => void
  onDelete: (index: number) => void
}

function SortableSlideItem({
  slide, index, isSelected, onSelect, onDelete,
}: {
  slide: Slide; index: number; isSelected: boolean
  onSelect: () => void; onDelete: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: slide.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const meta = SLIDE_TYPE_META[slide.type]
  const label = slide.type === 'title' ? (slide as { title?: string }).title || 'Title Slide'
    : slide.type === 'section' ? (slide as { heading?: string }).heading || 'Section'
    : slide.type === 'content' ? (slide as { heading?: string }).heading || 'Content'
    : slide.type === 'quote' ? (slide as { quote?: string }).quote?.substring(0, 30) || 'Quote'
    : slide.type === 'list' ? (slide as { heading?: string }).heading || 'List'
    : slide.type === 'closing' ? (slide as { heading?: string }).heading || 'Closing'
    : meta.label

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={`group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
        isSelected
          ? 'bg-cyan-500/20 border border-cyan-500/40'
          : 'hover:bg-white/5 border border-transparent'
      }`}
    >
      <button {...attributes} {...listeners} className="cursor-grab text-slate-600 hover:text-slate-400">
        <GripVertical size={14} />
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-600">{index + 1}</span>
          <span className="text-xs font-medium text-slate-300 truncate">{label}</span>
        </div>
        <span className="text-[10px] text-slate-600">{meta.label}</span>
      </div>
      <button
        onClick={e => { e.stopPropagation(); onDelete() }}
        className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all"
      >
        <Trash2 size={12} />
      </button>
    </div>
  )
}

export default function SlideNavigator({ slides, selectedIndex, onSelect, onReorder, onAdd, onDelete }: Props) {
  const [showTypePicker, setShowTypePicker] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = slides.findIndex(s => s.id === active.id)
      const newIndex = slides.findIndex(s => s.id === over.id)
      onReorder(arrayMove(slides, oldIndex, newIndex))
    }
  }

  const handleAddSlide = (type: SlideType) => {
    onAdd(createSlide(type))
    setShowTypePicker(false)
  }

  const estimatedMinutes = Math.round(slides.length * 2)

  return (
    <div className="w-64 flex-shrink-0 flex flex-col h-full" style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div>
          <span className="text-xs font-medium text-slate-400">{slides.length} slides</span>
          <span className="text-[10px] text-slate-600 ml-2">~{estimatedMinutes} min</span>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowTypePicker(!showTypePicker)}
            className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors"
          >
            <Plus size={14} />
          </button>

          {showTypePicker && (
            <div className="absolute right-0 top-full mt-1 w-48 rounded-lg shadow-xl z-50 py-1" style={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(16px)' }}>
              {(Object.entries(SLIDE_TYPE_META) as [SlideType, { label: string; description: string }][]).map(([type, meta]) => (
                <button
                  key={type}
                  onClick={() => handleAddSlide(type)}
                  className="w-full text-left px-3 py-2 hover:bg-white/5 transition-colors"
                >
                  <div className="text-xs font-medium text-slate-300">{meta.label}</div>
                  <div className="text-[10px] text-slate-600">{meta.description}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={slides.map(s => s.id)} strategy={verticalListSortingStrategy}>
            {slides.map((slide, i) => (
              <SortableSlideItem
                key={slide.id}
                slide={slide}
                index={i}
                isSelected={i === selectedIndex}
                onSelect={() => onSelect(i)}
                onDelete={() => onDelete(i)}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  )
}
