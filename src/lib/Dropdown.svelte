<script lang="ts">
    import { fade } from 'svelte/transition';

    let { show, children, class: className = "" } = $props<{
        show: boolean;
        children: any;
        class?: string;
    }>();
</script>

{#if show}
    <div 
        class="absolute top-8 left-0 z-[60] glass p-4 rounded-xl shadow-2xl border border-white/10 {className}" 
        in:fade={{ duration: 150 }}
        out:fade={{ duration: 100 }}
    >
        {@render children()}
    </div>
{/if}
