import { Inject, Injectable } from '@nestjs/common';
import { ConfigsService } from 'src/modules/utils.module/services/configs.service';
import { FileSystemService } from 'src/modules/utils.module/services/filesystem.service';

@Injectable()
export class StyleguideService {
  @Inject()
  private configs: ConfigsService;

  @Inject()
  private filesystem: FileSystemService;

  public get releasesDirectory(): string {
    return this.configs.readConfig(
      'STYLEGUIDE_DIR',
      this.filesystem.resolveFileRelativeToApp('./'),
    );
  }

  public get releases(): string[] {
    if (!this.filesystem.fileExist(this.releasesDirectory)) return [];
    return this.filesystem
      .listFilesInDirectory(this.releasesDirectory)
      .filter((d) => {
        const fullPath = this.filesystem.resolveFullPath(
          this.releasesDirectory,
          d,
        );
        return !d.startsWith('.') && this.filesystem.isDirectory(fullPath);
      });
  }

  public getProductsPathForRelease(release: string): string {
    return this.filesystem.resolveFullPath(
      this.releasesDirectory,
      `./${release}`,
      './ui-products',
    );
  }

  public getProductPathForRelease(release: string, product: string): string {
    return this.filesystem.resolveFullPath(
      this.getProductsPathForRelease(release),
      `./${product}`,
    );
  }

  public loadProducts(release: string): { [productName: string]: string } {
    return this.loadAllProductsRecusrsive(
      this.getProductsPathForRelease(release),
    )
      .filter((p) => p)
      .reduce((prev, current) => {
        return {
          [current.split('/').reverse()[0]]: current,
          ...prev,
        };
      }, {});
  }

  private loadAllProductsRecusrsive(path: string): string[] {
    if (!this.filesystem.fileExist(path)) return [];
    return this.filesystem.listFilesInDirectory(path).reduce((prev, file) => {
      const currentDirectoryFullPath = this.filesystem.resolveFullPath(
        path,
        file,
      );
      if (!this.filesystem.isDirectory(currentDirectoryFullPath)) return prev;
      let products = [];
      if (
        this.filesystem.fileExist(
          this.filesystem.resolveFullPath(
            currentDirectoryFullPath,
            'scss/build.scss',
          ),
        )
      )
        products.push(currentDirectoryFullPath);

      if (file !== 'node_modules')
        products = [
          ...products,
          ...this.loadAllProductsRecusrsive(currentDirectoryFullPath),
        ];
      return [...prev, ...products];
    }, []);
  }

  public getExtraTemplatesForSingleComponent(
    product: string,
    release: string,
    component: string,
  ): string[] {
    const lookupFolders = this.getTemplatesLookupFoldersForProduct(
      product,
      release,
    );
    return [
      ...new Set(
        lookupFolders
          .map((lookupFolder) =>
            this.filesystem.resolveFullPath(
              lookupFolder,
              `./${component}`,
              `./templates`,
              `./${component}`,
            ),
          )
          .filter((p) => this.filesystem.fileExist(p))
          .map((p) => {
            return this.filesystem
              .listFilesInDirectory(p)
              .filter(
                (t) =>
                  t.endsWith('-tmpl.jade') && t !== `${component}-tmpl.jade`,
              );
          })
          .flat(Infinity),
      ),
    ] as string[];
  }

  private getTemplatesLookupFoldersForProduct(
    _product: string,
    release: string,
    onlyProductLevel = false,
  ): string[] {
    let product;
    if (_product.indexOf('/') > -1)
      product = this.filesystem.resolveFullPath(
        this.releasesDirectory,
        `./${release}`,
        './ui-products',
        `./${_product}`,
      );
    else product = this.loadProducts(release)[_product];

    const lookupFolders = [
      '/basic/',
      '/components/',
      '/widgets/',
      '/widgets/commerce/widgets/',
      '/widgets/raa/widgets/',
      '/page-structure/',
    ].reverse();
    return product
      .split('ui-products/')[1]
      .split('/')
      .reduce((prevPaths, path) => {
        const last = [...prevPaths].reverse()[0] || '';
        return [...prevPaths, `${last}/${path}`];
      }, [])
      .map((p) =>
        this.filesystem.resolveFullPath(
          this.releasesDirectory,
          `./${release}`,
          './ui-products',
          `./${p}`,
        ),
      )
      .map((productLevel, index) => {
        const lookupFiles = [];
        lookupFiles.push(
          ['ui-core', 'ui-article', 'ui-theme'].map((l) =>
            (l === 'ui-article' ? ['.'] : lookupFolders).map((f) => {
              return {
                productLevel: false,
                level: index,
                path: this.filesystem.resolveFullPath(
                  productLevel,
                  './node_modules',
                  `./${l}`,
                  `./${f}`,
                ),
              };
            }),
          ),
        );
        lookupFiles.push(
          lookupFolders.map((f) => {
            return {
              productLevel: true,
              level: index,
              path: this.filesystem.resolveFullPath(productLevel, `./${f}`),
            };
          }),
        );
        return lookupFiles;
      })
      .flat(Infinity)
      .filter((p) => this.filesystem.fileExist(p.path))
      .filter((p) => {
        if (onlyProductLevel) return p.level === 0 && p.productLevel;
        return true;
      })
      .map((p) => p.path)
      .reverse();
  }

  public getTemplatePath(
    release: string,
    product: string,
    component: string,
    template: string = component,
  ): string {
    const lookups = this.getTemplatesLookupFoldersForProduct(
      product,
      release,
      component === 'structure',
    );
    return lookups
      .map((path) => [
        this.filesystem.resolveFullPath(
          path,
          `./${component}/templates/${component}/${template}`,
        ),
        this.filesystem.resolveFullPath(
          path,
          `./${component}/templates/${template}`,
        ),
      ])
      .flat(Infinity)
      .map((t: string) => t.concat('-tmpl.jade'))
      .find((t: string) => this.filesystem.fileExist(t)) as string;
  }
}
