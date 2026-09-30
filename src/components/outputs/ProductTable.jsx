import { CheckCircle2, Download, Eye } from 'lucide-react';
import { Panel } from '../ui/Panel';

export function ProductTable({ products }) {
  return (
    <Panel title="Generated Products" action={<span className="text-[10px] text-muted-foreground">{products.length} products</span>}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left text-[10px]">
          <thead><tr className="border-b border-border text-muted-foreground"><th className="px-2 py-2 font-medium">Product</th><th className="px-2 py-2 font-medium">Format</th><th className="px-2 py-2 font-medium">Size</th><th className="px-2 py-2 font-medium">Status</th><th className="px-2 py-2 text-right font-medium">Actions</th></tr></thead>
          <tbody>
            {products.map((item) => <tr key={item.id} className="border-b border-border/70 last:border-0 hover:bg-secondary/40">
              <td className="px-2 py-2.5"><div className="text-foreground">{item.product}</div><div className="mt-0.5 text-[9px] text-muted-foreground">{item.description}</div></td>
              <td className="px-2 py-2.5 font-mono text-muted-foreground">{item.format}</td>
              <td className="px-2 py-2.5 font-mono text-muted-foreground">{item.size}</td>
              <td className="px-2 py-2.5"><span className="inline-flex items-center gap-1.5 text-status-ok"><CheckCircle2 className="size-3" />Completed</span></td>
              <td className="px-2 py-2.5"><div className="flex justify-end gap-1"><button type="button" className="inline-flex items-center gap-1 rounded-sm border border-border px-2 py-1 text-[9px] text-muted-foreground hover:text-foreground"><Eye className="size-3" />View</button><button type="button" className="inline-flex items-center gap-1 rounded-sm border border-accent/40 bg-accent/10 px-2 py-1 text-[9px] text-foreground hover:bg-accent/20"><Download className="size-3" />Export</button></div></td>
            </tr>)}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
