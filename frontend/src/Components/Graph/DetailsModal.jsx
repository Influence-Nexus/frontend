import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';

export const DetailsModal = ({ open, handleClose, cardData, planetColor }) => {
  if (!cardData) {
    return null;
  }

  const { title, image, description, paper, link } = cardData;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: 'rgb(0, 0, 0)',
          backdropFilter: 'blur(3px)',
          border: '1px solid rgb(194, 194, 194)',
          color: '#fff',
          borderRadius: '15px',
          boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.2)',
          fontFamily: "'Montserrat', sans-serif",
          overflow: 'hidden',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          margin: '2rem auto',
        },
      }}
      sx={{
        '& .MuiDialog-container': {
          justifyContent: 'center',
          alignItems: 'center',
        },
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(5px)',
        },
      }}
    >
      <DialogTitle
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: '10px',
          marginBottom: '0.5rem',
          borderBottom: '1px solid white',
          padding: '20px',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: 'rgb(255, 218, 150)',
        }}
      >
        {title}
        <button
          className="close-card-modal-window"
          onClick={handleClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        >
          <CloseIcon
            fontSize="large"
            style={{ color: planetColor || 'inherit' }}
          />
        </button>
      </DialogTitle>
      <DialogContent
        dividers
        sx={{
          flex: 1,
          overflowY: 'auto',
          padding: '0 20px',
          '&::-webkit-scrollbar': { width: '8px', height: '8px' },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'rgba(255, 255, 255, 0.4)',
          },
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255, 255, 255, 0.3) rgba(255, 255, 255, 0.1)',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            padding: '20px 0',
          }}
        >
          {image && (
            <img
              src={image}
              alt={title || 'Selected Item'}
              style={{
                maxWidth: '70%',
                maxHeight: '200px',
                width: 'auto',
                height: 'auto',
                display: 'block',
                margin: '0 auto 16px auto',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                objectFit: 'contain',
              }}
            />
          )}
          {description && (
            <div
              style={{
                textAlign: 'left',
                marginBottom: '16px',
                color: '#fff',
                fontSize: '18px',
                padding: '10px',
                borderRadius: '15px',
                cursor: 'default',
                width: '100%',
                maxHeight: '200px',
                overflowY: 'auto',
              }}
            >
              <p>{description}</p>
              {paper && (
                <>
                  <br />
                  <p style={{ color: 'rgb(255, 218, 150)' }}>Источник: </p>
                  <p>{paper}</p>
                </>
              )}
              {link && (
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={link}
                  style={{
                    color: planetColor || 'blue',
                    display: 'block',
                    marginTop: '8px',
                    textDecoration: 'underline',
                  }}
                >
                  Ссылка на статью
                </a>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
