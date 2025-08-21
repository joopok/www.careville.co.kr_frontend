# Vim Yank Mode Implementation

A complete vim yank/paste system implementation for React applications, providing full register support, motion-based operations, and visual mode selection.

## Features

### Core Functionality
- **Multiple Registers**: Unnamed register, 26 named registers (a-z), numbered registers (0-9), and system clipboard integration
- **Motion-Based Yanking**: Support for `yy`, `yw`, `y$`, `yh`, `yl`, `yj`, `yk`, and more
- **Visual Mode**: Character-wise and line-wise visual selection with yanking
- **Paste Operations**: `p` (paste after) and `P` (paste before) with proper line/character handling
- **Register Selection**: `"a` through `"z` for named registers, uppercase for append mode
- **Clipboard Integration**: `"+` and `"*` registers for system clipboard access

### Supported Commands

#### Yank Commands
- `yy` - Yank current line
- `{count}yy` - Yank count lines
- `yw` - Yank word
- `y$` - Yank to end of line
- `y^` - Yank to beginning of line
- `y0` - Yank to first column
- `yG` - Yank to end of document
- `ygg` - Yank to beginning of document

#### Visual Mode
- `v` - Enter character-wise visual mode
- `V` - Enter line-wise visual mode
- `y` - Yank selection
- `d` or `x` - Delete selection (and yank)
- `c` - Change selection (yank and enter insert mode)

#### Paste Commands
- `p` - Paste after cursor/line
- `P` - Paste before cursor/line
- `{count}p` - Paste count times

#### Register Operations
- `"ay` - Yank into register 'a'
- `"Ay` - Append yank to register 'a'
- `"ap` - Paste from register 'a'
- `"+y` - Yank to system clipboard
- `"+p` - Paste from system clipboard

## Usage

### Basic Integration

```typescript
import { useVimMode } from '@/hooks/useVimMode';

function Editor() {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const { state, mode, registers, executeCommand } = useVimMode({
    textAreaRef,
    initialMode: 'normal',
    onStateChange: (state) => {
      console.log('Vim state changed:', state);
    }
  });

  return (
    <div>
      <div>Mode: {mode}</div>
      <textarea ref={textAreaRef} />
    </div>
  );
}
```

### Programmatic Control

```typescript
const { setMode, executeCommand, getRegisters } = useVimMode();

// Change mode
setMode('insert');
setMode('visual');
setMode('normal');

// Execute commands
executeCommand('yy');     // Yank line
executeCommand('"ayy');   // Yank line to register 'a'
executeCommand('p');      // Paste

// Access registers
const registers = getRegisters();
const unnamedContent = registers.get('"');
const registerA = registers.get('a');
```

### Custom Text Buffer

Implement the `TextBuffer` interface for custom text sources:

```typescript
class CustomBuffer implements TextBuffer {
  getLine(lineNumber: number): string {
    // Return line content
  }
  
  getLineCount(): number {
    // Return total lines
  }
  
  getText(start: VimPosition, end: VimPosition): string {
    // Return text between positions
  }
}

const vimCore = new VimCore(new CustomBuffer());
```

## Architecture

### Core Components

1. **VimCore** (`core.ts`)
   - Main state machine
   - Mode management
   - Key event processing
   - Visual selection handling

2. **RegisterManager** (`registers.ts`)
   - Register storage and retrieval
   - Numbered register rotation
   - Clipboard integration
   - Append mode support

3. **CommandProcessor** (`commands.ts`)
   - Command parsing
   - Operator-motion composition
   - Register selection
   - Count handling

4. **MotionParser** (`motions.ts`)
   - Motion calculation
   - Text selection
   - Word/line/document movements

### State Management

```typescript
interface VimState {
  mode: VimMode;                    // Current mode
  position: VimPosition;            // Cursor position
  selection: VimSelection | null;   // Visual selection
  registers: VimRegisters;          // All registers
  lastCommand: string;              // Last executed command
  count: number;                    // Command count
  pendingOperator: string | null;   // Pending operator
  searchPattern: string;            // Search pattern
  marks: Record<string, VimPosition>; // Marks
}
```

## Testing

Run tests with:

```bash
npm test src/lib/vim
```

Test coverage includes:
- Register operations (unnamed, named, numbered)
- Command parsing and execution
- Motion calculations
- Visual mode selection
- Clipboard integration

## Future Enhancements

- [ ] Text object support (`yiw`, `ya"`, `yi{`)
- [ ] Macro recording and playback
- [ ] Search motion integration (`y/pattern`)
- [ ] Visual block mode
- [ ] Undo/redo integration
- [ ] Mark support for yanking (`y'a`)
- [ ] Ex command support (`:registers`)

## License

MIT