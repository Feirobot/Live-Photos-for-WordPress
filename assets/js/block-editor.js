(function(wp) {
    var registerBlockType = wp.blocks.registerBlockType;
    var InspectorControls = wp.blockEditor.InspectorControls;
    var MediaUpload = wp.blockEditor.MediaUpload;
    var MediaUploadCheck = wp.blockEditor.MediaUploadCheck;
    var PanelBody = wp.components.PanelBody;
    var Button = wp.components.Button;
    var Placeholder = wp.components.Placeholder;
    var RangeControl = wp.components.RangeControl;
    var ToggleControl = wp.components.ToggleControl;
    
    var el = wp.element.createElement;
    
    registerBlockType('live-photos-final/block', {
        title: '实况照片',
        icon: 'format-image',
        category: 'media',
        attributes: {
            photoUrl: {
                type: 'string',
                default: ''
            },
            videoUrl: {
                type: 'string',
                default: ''
            },
            width: {
                type: 'number',
                default: 600
            },
            muted: {
                type: 'boolean',
                default: true
            },
            className: {
                type: 'string',
                default: ''
            }
        },
        
        edit: function(props) {
            var attributes = props.attributes;
            var setAttributes = props.setAttributes;
            
            // 选择图片或视频
            var onSelectImage = function(media) {
                setAttributes({
                    photoUrl: media.url
                });
            };
            
            var onSelectVideo = function(media) {
                setAttributes({
                    videoUrl: media.url
                });
            };
            
            // 移除媒体
            var removeMedia = function(type) {
                if (type === 'photo') {
                    setAttributes({ photoUrl: '' });
                } else {
                    setAttributes({ videoUrl: '' });
                }
            };
            
            return el('div', { className: 'live-photo-edit' },
                el(InspectorControls, null,
                    el(PanelBody, { title: '实况照片设置', initialOpen: true },
                        el(RangeControl, {
                            label: '最大宽度',
                            value: attributes.width,
                            onChange: function(value) { setAttributes({ width: value }); },
                            min: 300,
                            max: 1200,
                            step: 50
                        }),
                        el(ToggleControl, {
                            label: '静音播放',
                            checked: attributes.muted,
                            help: '是否静音播放视频',
                            onChange: function(value) { setAttributes({ muted: value }); }
                        })
                    )
                ),
                
                !attributes.photoUrl && !attributes.videoUrl &&
                    el(Placeholder, {
                        icon: 'format-image',
                        label: '实况照片',
                        instructions: '选择图片和视频文件创建实况照片效果。照片将自适应原始比例显示。'
                    },
                        el('div', { className: 'live-photo-media-buttons' },
                            el(MediaUploadCheck, null,
                                el(MediaUpload, {
                                    onSelect: onSelectImage,
                                    allowedTypes: ['image'],
                                    render: function(_ref) {
                                        var open = _ref.open;
                                        return el(Button, { 
                                            isPrimary: true, 
                                            onClick: open 
                                        }, '选择图片');
                                    }
                                })
                            ),
                            el(MediaUploadCheck, null,
                                el(MediaUpload, {
                                    onSelect: onSelectVideo,
                                    allowedTypes: ['video'],
                                    render: function(_ref) {
                                        var open = _ref.open;
                                        return el(Button, { 
                                            isPrimary: true, 
                                            onClick: open 
                                        }, '选择视频');
                                    }
                                })
                            )
                        )
                    ),
                
                (attributes.photoUrl || attributes.videoUrl) &&
                    el('div', { className: 'live-photo-preview' },
                        el('h4', { style: { marginTop: 0 } }, '实况照片预览 (自适应比例)'),
                        el('div', { className: 'live-photo-media-preview' },
                            attributes.photoUrl && 
                                el('div', { className: 'live-photo-preview-item' },
                                    el('h5', null, '图片预览'),
                                    el('div', { style: { 
                                        maxWidth: '200px', 
                                        overflow: 'hidden',
                                        borderRadius: '4px',
                                        position: 'relative',
                                        backgroundColor: '#f0f0f0'
                                    } },
                                        el('img', { 
                                            src: attributes.photoUrl, 
                                            alt: '实况照片图片',
                                            style: { 
                                                width: '100%',
                                                height: 'auto',
                                                display: 'block'
                                            }
                                        })
                                    ),
                                    el(Button, { 
                                        isDestructive: true,
                                        onClick: function() { removeMedia('photo'); },
                                        style: { marginTop: '10px' }
                                    }, '移除图片')
                                ),
                            
                            attributes.videoUrl && 
                                el('div', { className: 'live-photo-preview-item' },
                                    el('h5', null, '视频预览'),
                                    el('div', { style: { 
                                        maxWidth: '200px', 
                                        overflow: 'hidden',
                                        borderRadius: '4px',
                                        position: 'relative',
                                        backgroundColor: '#f0f0f0'
                                    } },
                                        el('video', { 
                                            src: attributes.videoUrl,
                                            controls: true,
                                            style: { 
                                                width: '100%',
                                                height: 'auto',
                                                display: 'block'
                                            }
                                        })
                                    ),
                                    el(Button, { 
                                        isDestructive: true,
                                        onClick: function() { removeMedia('video'); },
                                        style: { marginTop: '10px' }
                                    }, '移除视频')
                                )
                        ),
                        
                        (!attributes.photoUrl || !attributes.videoUrl) &&
                            el(Placeholder, null,
                                el('div', { className: 'live-photo-media-buttons' },
                                    !attributes.photoUrl &&
                                        el(MediaUploadCheck, null,
                                            el(MediaUpload, {
                                                onSelect: onSelectImage,
                                                allowedTypes: ['image'],
                                                render: function(_ref) {
                                                    var open = _ref.open;
                                                    return el(Button, { 
                                                        isPrimary: true, 
                                                        onClick: open 
                                                    }, '选择图片');
                                                }
                                            })
                                        ),
                                    
                                    !attributes.videoUrl &&
                                        el(MediaUploadCheck, null,
                                            el(MediaUpload, {
                                                onSelect: onSelectVideo,
                                                allowedTypes: ['video'],
                                                render: function(_ref) {
                                                    var open = _ref.open;
                                                    return el(Button, { 
                                                        isPrimary: true, 
                                                        onClick: open 
                                                    }, '选择视频');
                                                }
                                            })
                                        )
                                )
                            ),
                            
                        attributes.photoUrl && attributes.videoUrl &&
                            el('div', { style: { marginTop: '20px', padding: '10px', backgroundColor: '#f0f8ff', borderRadius: '4px' } },
                                el('p', { style: { margin: 0 } }, '桌面设备: 鼠标悬停在左上角"LIVE"徽章上播放视频'),
                                el('p', { style: { margin: '5px 0 0 0' } }, '移动设备: 触摸图片播放视频'),
                                el('p', { style: { margin: '5px 0 0 0', fontStyle: 'italic' } }, '实况照片将自适应原始比例显示')
                            )
                    )
            );
        },
        
        save: function() {
            return null; // 使用动态渲染
        }
    });
})(wp);