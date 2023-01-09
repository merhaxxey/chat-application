<div className="sent">    
    <div className="message">
        <span className='meta-info'>11:09</span>
        <div id='file-msg' className='file-msg actual-message' >
            
            <div className='icon-wrapper'>
                {isDownloading && <div className='icon working'>
                    <CircularLoading />
                </div>}
                {!isDownloading && <AiOutlineDownload onClick={handleDownload} className='icon download-btn' />}
            </div>
            <div className='media-info'>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <p className='file-type'>Video File</p>
                    <button type='open'>Open</button>
                </div>
                <p className='file-name'>Soleers of bengazi... .mp4</p>
            </div>
        </div>
    </div>
</div>