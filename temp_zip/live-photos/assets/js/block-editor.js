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
    var Tooltip = wp.components.Tooltip;

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

            // 判断是否已选择媒体
            var hasPhoto = !!attributes.photoUrl;
            var hasVideo = !!attributes.videoUrl;
            var isComplete = hasPhoto && hasVideo;

            // 渲染媒体选择按钮
            var renderUploadButton = function(type, open) {
                var isPhoto = type === 'photo';
                var icon = isPhoto ? '🖼️' : '🎬';
                var text = isPhoto ? '选择图片' : '选择视频';

                return el('div', {
                    className: 'live-photo-upload-placeholder',
                    onClick: open
                },
                    el('span', { className: 'upload-icon' }, icon),
                    el('span', { className: 'upload-text' }, text)
                );
            };

            // 渲染图片卡片
            var renderImageCard = function() {
                var className = 'live-photo-preview-item image-item' + (hasPhoto ? ' has-media' : '');

                return el('div', { className: className },
                    el('h5', null, '图片'),
                    el('div', { className: 'live-photo-media-container' },
                        hasPhoto
                            ? el('img', {
                                src: attributes.photoUrl,
                                alt: '实况照片图片'
                            })
                            : el(MediaUploadCheck, null,
                                el(MediaUpload, {
                                    onSelect: onSelectImage,
                                    allowedTypes: ['image'],
                                    render: function(_ref) {
                                        return renderUploadButton('photo', _ref.open);
                                    }
                                })
                            )
                    ),
                    el('div', { className: 'live-photo-actions' },
                        hasPhoto
                            ? [
                                el(MediaUploadCheck, { key: 'change' },
                                    el(MediaUpload, {
                                        onSelect: onSelectImage,
                                        allowedTypes: ['image'],
                                        render: function(_ref) {
                                            return el(Button, {
                                                isSecondary: true,
                                                onClick: _ref.open,
                                                className: 'live-photo-btn live-photo-btn-primary'
                                            }, '🔄 更换');
                                        }
                                    })
                                ),
                                el(Button, {
                                    key: 'remove',
                                    isDestructive: true,
                                    onClick: function() { removeMedia('photo'); },
                                    className: 'live-photo-btn live-photo-btn-danger'
                                }, '🗑️ 删除')
                            ]
                            : null
                    )
                );
            };

            // 渲染视频卡片
            var renderVideoCard = function() {
                var className = 'live-photo-preview-item video-item' + (hasVideo ? ' has-media' : '');

                return el('div', { className: className },
                    el('h5', null, '视频'),
                    el('div', { className: 'live-photo-media-container' },
                        hasVideo
                            ? el('video', {
                                src: attributes.videoUrl,
                                controls: true,
                                preload: 'metadata'
                            })
                            : el(MediaUploadCheck, null,
                                el(MediaUpload, {
                                    onSelect: onSelectVideo,
                                    allowedTypes: ['video'],
                                    render: function(_ref) {
                                        return renderUploadButton('video', _ref.open);
                                    }
                                })
                            )
                    ),
                    el('div', { className: 'live-photo-actions' },
                        hasVideo
                            ? [
                                el(MediaUploadCheck, { key: 'change' },
                                    el(MediaUpload, {
                                        onSelect: onSelectVideo,
                                        allowedTypes: ['video'],
                                        render: function(_ref) {
                                            return el(Button, {
                                                isSecondary: true,
                                                onClick: _ref.open,
                                                className: 'live-photo-btn live-photo-btn-primary'
                                            }, '🔄 更换');
                                        }
                                    })
                                ),
                                el(Button, {
                                    key: 'remove',
                                    isDestructive: true,
                                    onClick: function() { removeMedia('video'); },
                                    className: 'live-photo-btn live-photo-btn-danger'
                                }, '🗑️ 删除')
                            ]
                            : null
                    )
                );
            };

            return el('div', { className: 'live-photo-edit' },
                // 主卡片区域
                el('div', { className: 'live-photo-card' },
                    el('h4', { className: 'live-photo-card-title' },
                        isComplete ? '✨ Live Photo 已就绪' : '📸 创建 Live Photo'
                    ),

                    // 媒体预览区域 - 并排显示
                    el('div', { className: 'live-photo-media-preview' },
                        renderImageCard(),
                        renderVideoCard()
                    ),

                    // 完成提示
                    isComplete && el('div', { className: 'live-photo-hint' },
                        el('p', null, '💡 桌面端：鼠标悬停在图片上播放视频'),
                        el('p', null, '📱 移动端：触摸图片播放视频'),
                        el('p', null, '📐 照片将自适应原始比例显示')
                    )
                ),

                // 侧边栏设置
                el(InspectorControls, null,
                    el(PanelBody, { title: '⚙️ Live Photo 设置', initialOpen: true },
                        el('div', { className: 'live-photo-settings' },
                            el('div', { className: 'live-photo-setting-item' },
                                el('label', { className: 'live-photo-setting-label' }, '最大宽度'),
                                el(RangeControl, {
                                    value: attributes.width,
                                    onChange: function(value) { setAttributes({ width: value }); },
                                    min: 200,
                                    max: 1200,
                                    step: 50,
                                    beforeIcon: 'image-flip-horizontal',
                                    afterIcon: 'image-flip-horizontal'
                                })
                            ),
                            el('div', { className: 'live-photo-setting-item' },
                                el(ToggleControl, {
                                    label: '静音播放',
                                    checked: attributes.muted,
                                    help: attributes.muted ? '视频将静音播放' : '视频将播放声音',
                                    onChange: function(value) { setAttributes({ muted: value }); }
                                })
                            ),
                            el('div', { className: 'live-photo-setting-item' },
                                el('label', { className: 'live-photo-setting-label' }, '当前设置'),
                                el('div', { style: {
                                    background: '#f5f7fa',
                                    padding: '10px',
                                    borderRadius: '6px',
                                    fontSize: '12px',
                                    color: '#666'
                                }},
                                    el('div', null, '宽度: ' + attributes.width + 'px'),
                                    el('div', null, '静音: ' + (attributes.muted ? '是' : '否')),
                                    el('div', null, '状态: ' + (isComplete ? '✅ 完整' : '⏳ 待完善'))
                                )
                            )
                        )
                    )
                )
            );
        },

        save: function() {
            return null; // 使用动态渲染
        }
    });
})(wp);