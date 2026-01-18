<!-- HTML Structure -->
<button id="subscribeBtn" class="btn-primary">Subscribe</button>

<div id="confirmModal" class="modal hidden">
  <div class="modal-content">
    <p>Are you sure you want to subscribe?</p>
    <div class="modal-actions">
      <button id="confirmBtn" class="btn-confirm">Confirm</button>
      <button id="cancelBtn" class="btn-cancel">Cancel</button>
    </div>
  </div>
</div>

<!-- CSS Styles -->
<style>
  .hidden { display: none; }
  
  .modal {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex; justify-content: center; align-items: center;
  }
  
  .modal-content {
    background: white; padding: 2rem; border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center;
  }
  
  .modal-actions { margin-top: 1.5rem; display: flex; gap: 1rem; justify-content: center; }
  
  .btn-primary { padding: 0.5rem 1rem; background: blue; color: white; border: none; cursor: pointer; }
  .btn-confirm { padding: 0.5rem 1rem; background: green; color: white; border: none; cursor: pointer; }
  .btn-cancel { padding: 0.5rem 1rem; background: gray; color: white; border: none; cursor: pointer; }
</style>

<!-- JavaScript Logic -->
<script>
  const modal = document.getElementById('confirmModal');
  const subscribeBtn = document.getElementById('subscribeBtn');
  const confirmBtn = document.getElementById('confirmBtn');
  const cancelBtn = document.getElementById('cancelBtn');

  // Open Modal
  subscribeBtn.addEventListener('click', () => {
    modal.classList.remove('hidden'); // Use flex to show
    modal.style.display = 'flex'; 
  });

  // Close Modal (Cancel)
  cancelBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Close Modal (Confirm)
  confirmBtn.addEventListener('click', () => {
    alert('Subscribed successfully!');
    modal.style.display = 'none';
  });

  // Close on outside click
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
</script>
