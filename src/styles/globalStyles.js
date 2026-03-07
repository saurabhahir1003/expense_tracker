export const GLOBAL_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Sora', sans-serif; background: #F0F4F8; }
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: #F0F4F8; }
  ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 99px; }
  input, select, textarea { font-family: 'Sora', sans-serif; }
  .fade { animation: fadeIn .3s ease; }
  @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
  .slide { animation: slideIn .25s ease; }
  @keyframes slideIn { from { opacity:0; transform:translateX(-12px); } to { opacity:1; transform:translateX(0); } }
  .pop { animation: pop .35s cubic-bezier(.34,1.56,.64,1); }
  @keyframes pop { from { opacity:0; transform:scale(.85); } to { opacity:1; transform:scale(1); } }
  .btn-hover { transition: all .18s; cursor: pointer; border: none; }
  .btn-hover:hover { filter: brightness(1.08); transform: translateY(-1px); }
  .btn-hover:active { transform: scale(.97); }
  .row-hover { transition: background .15s; }
  .row-hover:hover { background: #F1F5F9 !important; }
  .nav-item { transition: all .18s; cursor: pointer; border-radius: 10px; }
  .nav-item:hover { background: rgba(255,255,255,.15) !important; }
  .card-hover { transition: box-shadow .2s, transform .2s; }
  .card-hover:hover { box-shadow: 0 8px 32px rgba(15,118,110,.12) !important; transform: translateY(-2px); }
  .toast { animation: toastIn .4s cubic-bezier(.34,1.56,.64,1); }
  @keyframes toastIn { from { opacity:0; transform:translateX(60px); } to { opacity:1; transform:translateX(0); } }
  input[type=date]::-webkit-calendar-picker-indicator { filter: opacity(.5); cursor:pointer; }
`;
