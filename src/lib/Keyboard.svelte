<script lang="ts">
    import { onMount } from 'svelte';
    import { layouts } from './layouts';

    let { layoutName = "390", pressedKeys = {}, activeKey = "", isShiftPressed = false } = $props();

    const rows = [
        ["Backquote", "Digit1", "Digit2", "Digit3", "Digit4", "Digit5", "Digit6", "Digit7", "Digit8", "Digit9", "Digit0", "Minus", "Equal", "Backspace"],
        ["Tab", "KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU", "KeyI", "KeyO", "KeyP", "BracketLeft", "BracketRight", "Backslash"],
        ["CapsLock", "KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL", "Semicolon", "Quote", "Enter"],
        ["ShiftLeft", "KeyZ", "KeyX", "KeyC", "KeyV", "KeyB", "KeyN", "KeyM", "Comma", "Period", "Slash", "ShiftRight"],
        ["ControlLeft", "MetaLeft", "AltLeft", "Space", "AltRight", "MetaRight", "ContextMenu", "ControlRight"]
    ];

    const getLayout = (name: string) => layouts[name] || layouts["390"];
    const layout = $derived(getLayout(layoutName));

    const isPressed = (code: string) => !!pressedKeys[code] || activeKey === code;
    
    function getKeyData(code: string) {
        const data = layout.keys[code];
        if (data) return data;
        
        const defaults: Record<string, any> = {
            "Backspace": { label: "delete", width: "w-[94px]" }, 
            "Tab": { label: "tab", width: "w-[94px]" },      
            "CapsLock": { label: "caps", width: "w-[100px]" }, 
            "Enter": { label: "return", width: "w-[110px]" },  
            "ShiftLeft": { label: "shift", width: "w-[136px]" }, 
            "ShiftRight": { label: "shift", width: "w-[136px]" }, 
            "Space": { label: " ", width: "w-[428px]" },          
            "ControlLeft": { label: "ctrl", width: "w-[72px]" },
            "MetaLeft": { label: "cmd", width: "w-[54px]" },
            "AltLeft": { label: "alt", width: "w-[54px]" },
            "AltRight": { label: "alt", width: "w-[54px]" },
            "MetaRight": { label: "cmd", width: "w-[54px]" },
            "ControlRight": { label: "ctrl", width: "w-[72px]" },
            "ContextMenu": { label: "opt", width: "w-[54px]" },
            "Backquote": { label: "`", shiftLabel: "~" },
            "Minus": { label: "-", shiftLabel: "_" },
            "Equal": { label: "=", shiftLabel: "+" },
            "BracketLeft": { label: "[", shiftLabel: "{" },
            "BracketRight": { label: "]", shiftLabel: "}" },
            "Backslash": { label: "\\", shiftLabel: "|" },
            "Quote": { label: "'", shiftLabel: "\"" },
            "Slash": { label: "/", shiftLabel: "?" },
            "Semicolon": { label: ";", shiftLabel: ":" },
            "Comma": { label: ",", shiftLabel: "<" },
            "Period": { label: ".", shiftLabel: ">" }
        };
        return defaults[code] || { label: code.replace("Key", "").replace("Digit", "") };
    }

    function getKeyState(pressed: boolean) {
        if (pressed) return 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.4)] z-10 scale-[0.98]';
        return 'bg-white/[0.02] border-white/[0.06] text-white/30 hover:bg-white/[0.05] hover:border-white/[0.12]';
    }

</script>

    <div class="flex flex-col gap-1.5 w-max mx-auto p-4 glass rounded-[2rem]">
        {#each rows as row}
            <div class="flex gap-1.5 justify-center">
                {#each row as code}
                    {@const key = getKeyData(code)}
                    {@const pressed = isPressed(code)}
                    <div 
                        class="key-cap flex flex-col items-center justify-center rounded-xl transition-all duration-75 relative
                        {key.width || 'w-14 h-14'}
                        {getKeyState(pressed)}
                        border"
                    >
                        <!-- Main Label -->
                        <span class="text-lg font-medium font-sans lowercase">
                            {isShiftPressed && key.shiftLabel ? key.shiftLabel : key.label}
                        </span>
                        
                        <!-- Shift Label (Small) -->
                        {#if key.shiftLabel}
                            <span class="absolute top-1 left-2.5 text-[9px] font-medium opacity-20">
                                {isShiftPressed ? key.label : key.shiftLabel}
                            </span>
                        {/if}

                        <!-- Home row mark -->
                        {#if code === 'KeyF' || code === 'KeyJ'}
                            <div class="absolute bottom-2.5 w-3 h-[1.5px] {pressed ? 'bg-black/20' : 'bg-white/10'} rounded-full"></div>
                        {/if}
                    </div>
                {/each}
            </div>
        {/each}
    </div>


<style>
    .key-cap {
        backdrop-filter: blur(8px);
    }
</style>
