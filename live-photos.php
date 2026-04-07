<?php
/**
 * Plugin Name: Live Photos for WordPress
 * Description: 实现与苹果Live Photos相同效果的WordPress插件
 * Version: 1.3
 * Author: fei
 */

if (!defined('ABSPATH')) {
    exit;
}

class LivePhotosFinalPlugin {
    
    public function __construct() {
        add_action('init', array($this, 'init'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
        add_action('enqueue_block_editor_assets', array($this, 'enqueue_block_assets'));
        add_shortcode('live_photo', array($this, 'live_photo_shortcode'));
    }
    
    /**
     * 初始化插件
     */
    public function init() {
        // 注册古腾堡区块
        register_block_type('live-photos-final/block', array(
            'editor_script' => 'live-photos-final-block-editor',
            'render_callback' => array($this, 'render_block'),
            'attributes' => array(
                'photoUrl' => array('type' => 'string', 'default' => ''),
                'videoUrl' => array('type' => 'string', 'default' => ''),
                'width' => array('type' => 'number', 'default' => 600),
                'muted' => array('type' => 'boolean', 'default' => true),
                'className' => array('type' => 'string', 'default' => '')
            )
        ));
    }
    
    /**
     * 加载前端脚本和样式
     */
    public function enqueue_scripts() {
        // 只在需要时加载资源
        if (!is_admin() && $this->has_live_photo_content()) {
            // 前端初始化脚本
            wp_enqueue_script(
                'live-photos-final-frontend',
                plugin_dir_url(__FILE__) . 'assets/js/frontend.js',
                array(),
                '1.0.0',
                true
            );
            
            // 前端样式
            wp_enqueue_style(
                'live-photos-final-style',
                plugin_dir_url(__FILE__) . 'assets/css/style.css',
                array(),
                '1.0.0'
            );
        }
    }
    
    /**
     * 加载区块编辑器资源
     */
    public function enqueue_block_assets() {
        wp_enqueue_script(
            'live-photos-final-block-editor',
            plugin_dir_url(__FILE__) . 'assets/js/block-editor.js',
            array('wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor', 'wp-components'),
            '1.0.0'
        );
        
        wp_enqueue_style(
            'live-photos-final-editor-style',
            plugin_dir_url(__FILE__) . 'assets/css/editor.css',
            array('wp-edit-blocks'),
            '1.0.0'
        );
    }
    
    /**
     * 检查页面是否有实况照片内容
     */
    private function has_live_photo_content() {
        global $post;
        
        if (!is_a($post, 'WP_Post')) {
            return false;
        }
        
        // 检查文章内容中是否有实况照片短代码或区块
        return has_block('live-photos-final/block', $post) || 
               strpos($post->post_content, '[live_photo') !== false;
    }
    
    /**
     * 获取图片尺寸
     */
    private function get_image_dimensions($url) {
        // 如果是本地文件，尝试获取实际尺寸
        if (strpos($url, site_url()) !== false) {
            $upload_dir = wp_upload_dir();
            $file_path = str_replace($upload_dir['baseurl'], $upload_dir['basedir'], $url);
            
            if (file_exists($file_path)) {
                $size = getimagesize($file_path);
                if ($size) {
                    return array(
                        'width' => $size[0],
                        'height' => $size[1]
                    );
                }
            }
        }
        
        return false;
    }
    
    /**
     * 实况照片短代码
     */
    public function live_photo_shortcode($atts) {
        $atts = shortcode_atts(array(
            'photo' => '',
            'video' => '',
            'width' => '600',
            'muted' => 'true',
            'class' => ''
        ), $atts, 'live_photo');
        
        // 获取图片和视频URL
        if (is_numeric($atts['photo'])) {
            $photo_url = wp_get_attachment_url($atts['photo']);
            $photo_id = $atts['photo'];
        } else {
            $photo_url = $atts['photo'];
            $photo_id = 0;
        }
        
        if (is_numeric($atts['video'])) {
            $video_url = wp_get_attachment_url($atts['video']);
        } else {
            $video_url = $atts['video'];
        }
        
        if (empty($photo_url) || empty($video_url)) {
            return '<div class="live-photo-placeholder">请配置实况照片</div>';
        }
        
        $width = intval($atts['width']);
        $muted = filter_var($atts['muted'], FILTER_VALIDATE_BOOLEAN);
        
        // 使用本地图标
        $live_icon = plugin_dir_url(__FILE__) . 'images/live-icon.png';
        
        // 使用原生HTML5实现实况照片效果（已去除声音控件）
        return sprintf(
            '<div class="live-photo %s" style="max-width: %spx;" data-muted="%s">
                <div class="container">
                    <video src="%s" playsinline preload="metadata" %s></video>
                    <img src="%s" alt="" loading="lazy" onload="window.livePhotosInit && window.livePhotosInit(this)">
                </div>
                <div class="icon">
                    <img src="%s" class="no-zoom static" loading="lazy">
                    <span>LIVE</span>
                </div>
            </div>',
            esc_attr($atts['class']),
            $width,
            $muted ? 'true' : 'false',
            esc_url($video_url),
            $muted ? 'muted' : '',
            esc_url($photo_url),
            $live_icon
        );
    }
    
    /**
     * 渲染古腾堡区块
     */
    public function render_block($attributes) {
        $photo_url = isset($attributes['photoUrl']) ? esc_url($attributes['photoUrl']) : '';
        $video_url = isset($attributes['videoUrl']) ? esc_url($attributes['videoUrl']) : '';
        $width = isset($attributes['width']) ? esc_attr($attributes['width']) : 600;
        $muted = isset($attributes['muted']) ? $attributes['muted'] : true;
        $class_name = isset($attributes['className']) ? esc_attr($attributes['className']) : '';
        
        if (empty($photo_url) || empty($video_url)) {
            return '<div class="live-photo-placeholder">请配置实况照片</div>';
        }
        
        // 使用本地图标
        $live_icon = plugin_dir_url(__FILE__) . 'images/live-icon.png';
        
        // 使用原生HTML5实现实况照片效果（已去除声音控件）
        return sprintf(
            '<div class="live-photo %s" style="max-width: %spx;" data-muted="%s">
                <div class="container">
                    <video src="%s" playsinline preload="metadata" %s></video>
                    <img src="%s" alt="" loading="lazy" onload="window.livePhotosInit && window.livePhotosInit(this)">
                </div>
                <div class="icon">
                    <img src="%s" class="no-zoom static" loading="lazy">
                    <span>LIVE</span>
                </div>
            </div>',
            $class_name,
            $width,
            $muted ? 'true' : 'false',
            $video_url,
            $muted ? 'muted' : '',
            $photo_url,
            $live_icon
        );
    }
}

new LivePhotosFinalPlugin();