<!-- HTML Structure -->
<button id="subscribeBtn" class="btn-primary">Subscribe</button>

<div id="confirmModal" class="modal hidden" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
  <div class="modal-content" role="document">
    <h2 id="modalTitle">Confirm Action</h2>
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
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.5);
    display: flex; justify-content: center; align-items: center;
  }

  .modal-content {
    background: white; padding: 2rem; border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center;
    width: min(90%, 400px);
  }

  .modal-actions { margin-top: 1.5rem; display: flex; gap: 1rem; justify-content: center; }

  .btn-primary { padding: 0.5rem 1rem; background: #2563eb; color: white; border: none; cursor: pointer; }
  .btn-confirm { padding: 0.5rem 1rem; background: #16a34a; color: white; border: none; cursor: pointer; }
  .btn-cancel { padding: 0.5rem 1rem; background: #6b7280; color: white; border: none; cursor: pointer; }
</style>

<!-- JavaScript Logic -->
<script>
  const modal = document.getElementById('confirmModal');
  const subscribeBtn = document.getElementById('subscribeBtn');
  const confirmBtn = document.getElementById('confirmBtn');
  const cancelBtn = document.getElementById('cancelBtn');

  const openModal = () => {
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
    confirmBtn.focus();
  };

  const closeModal = () => {
    modal.style.display = 'none';
    modal.classList.add('hidden');
    subscribeBtn.focus();
  };

  subscribeBtn.addEventListener('click', openModal);
  cancelBtn.addEventListener('click', closeModal);

  confirmBtn.addEventListener('click', () => {
    alert('Subscribed successfully!');
    closeModal();
  });

  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
</script>
